import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  currency: string;
  image: string | null;
  language: "en" | "am" | "om";
  isActive: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
}

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    currency: {
      type: String,
      default: "ETB",
    },
    language: {
      type: String,
      enum: ["en", "am", "om"],
      default: "en",
      validate: {
        validator: function (v: string) {
          return ["en", "am", "om"].includes(v);
        },
        message: (props) =>
          `${props.value} is not a supported language. Supported languages are: en, am, om`,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Hash password before updating user password
UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && "password" in update && update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// Add method to compare passwords
UserSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument, IUserModel>(
  "User",
  UserSchema
);
