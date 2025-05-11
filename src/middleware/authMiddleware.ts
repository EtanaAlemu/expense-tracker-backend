import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUserDocument } from "../models/User";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

interface JwtPayload {
  id: string;
}

//Request no authenticated but if it has a token, user will be attached to the request
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = await User.findById(decoded.id).select("-password");
  } catch (error) {
    return next();
  }

  next();
};

// Protect routes (Require Authentication)
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
};

// Admin Middleware (Require Admin Role)
export const adminProtect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};
