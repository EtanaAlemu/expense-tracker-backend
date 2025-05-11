import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorMiddleware";
import { loggerMiddleware } from "./middleware/loggerMiddleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import expenseRoutes from "./routes/expenseRoutes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(loggerMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/expenses", expenseRoutes);

// Error handling
app.use(errorHandler);

export default app;
