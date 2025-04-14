import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User, IUserDocument } from '../models/User';
import { CreateUserRequest, LoginRequest } from '../dto/user.dto';

// Load environment variables
dotenv.config();

// Generate JWT Token
const generateToken = (user: IUserDocument): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
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

export const registerUser = async (req: Request<{}, {}, CreateUserRequest>, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create new user
    user = new User({ firstName, lastName, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ message: "Your account is deactivated. Please contact support." });
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
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const forgotPassword = async (req: Request<{}, {}, { email: string }>, res: Response): Promise<void> => {
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
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

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
        res.status(500).json({ message: "Email sending failed", error: err.message });
        return;
      }
      console.log("✅ Email sent successfully:", info.response);
      res.status(200).json({ message: "Password reset link sent to your email" });
    });

  } catch (error) {
    console.error("❌ Server error:", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const resetPassword = async (req: Request<{}, {}, { token: string; password: string }>, res: Response): Promise<void> => {
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
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 