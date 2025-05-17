import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User, IUserDocument } from "../models/User";
import { CreateUserRequest, LoginRequest } from "../dto/user.dto";
import {
  ChangePasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "../dto/auth.dto";

// Load environment variables
dotenv.config();

// Generate JWT Token
const generateToken = (user: IUserDocument): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
const sendVerificationEmail = async (
  user: IUserDocument,
  code: string
): Promise<void> => {
  const htmlEmail = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a6ee0; color: white; padding: 10px 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .code { font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background-color: #f5f5f5; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Email Verification</h2>
        </div>
        <div class="content">
          <p>Hello ${user.firstName},</p>
          <p>Thank you for registering with Expense Tracker. Please use the following verification code to verify your email address:</p>
          
          <div class="code">${code}</div>
          
          <p>This code will expire in 1 hour for security reasons.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email - Expense Tracker",
    html: htmlEmail,
  };

  await transporter.sendMail(mailOptions);
};

export const registerUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but is not verified, resend verification code
      if (!user.isVerified) {
        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour expiry

        // Update user with new verification code
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        // Send new verification email
        await sendVerificationEmail(user, verificationCode);

        res.status(201).json({
          message: "Verification code resent. Please check your email.",
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
        return;
      }

      // If user exists and is verified, return error
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });
    await user.save();

    // Send verification email
    await sendVerificationEmail(user, verificationCode);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification code.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid or expired verification code",
      });
      return;
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationCode = "";
    user.verificationCodeExpires = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currency: user.currency,
        language: user.language,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const resendVerification = async (
  req: Request<{}, {}, ResendVerificationRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified" });
      return;
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send new verification email
    await sendVerificationEmail(user, verificationCode);

    res.status(200).json({
      message: "Verification code resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Check if user is verified
    if (!user.isVerified) {
      res.status(403).json({
        message: "Please verify your email before logging in",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        message: "Your account is deactivated. Please contact support.",
      });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currency: user.currency,
        language: user.language,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      res.status(400).json({ message: "User with this email does not exist" });
      return;
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store token and expiration in DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
    await user.save();

    const webLink = `${process.env.CLIENT_URL}?token=${resetToken}`;

    // HTML email template with device detection
    const htmlEmail = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a6ee0; color: white; padding: 10px 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          .button { display: inline-block; background-color: #4a6ee0; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${user.firstName},</p>
            <p>You requested to reset your password for your Expense Tracker account.</p>
            
            <div id="web-link">
              <!-- For desktop devices -->
              <a href="${webLink}" class="button">Reset Password</a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request - Expense Tracker",
      html: htmlEmail,
    };

    console.log("📤 Sending email to:", user.email);

    // Send email and log the result
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Email sending failed:", err.message);
        res
          .status(500)
          .json({ message: "Email sending failed", error: err.message });
        return;
      }
      console.log("✅ Email sent successfully:", info.response);
      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    });
  } catch (error) {
    console.error(
      "❌ Server error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const resetPassword = async (
  req: Request<{}, {}, { token: string; password: string }>,
  res: Response
): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Hash token to match stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }, // Check if token is not expired
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    // Assign new password directly – hashing will be handled by pre('save') middleware
    user.password = password;

    // Clear reset token fields
    user.resetPasswordToken = "";
    user.resetPasswordExpires = new Date();

    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordRequest>,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Use the model's comparePassword method
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    // Simply update the password - the pre-save hook will handle hashing
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
