import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
// import { bootstrap } from "./bootstrap";
import { requestLogger } from "./middleware/loggerMiddleware";

// Import routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import swaggerRoutes from "./routes/swaggerRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(requestLogger); 

// Load routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api-docs", swaggerRoutes);

// Connect to Database and Bootstrap
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    // Bootstrap the application after database connection
    // await bootstrap();
    // console.log("✅ Application bootstrap completed successfully");

    // Start server
    const PORT: number = parseInt(process.env.PORT || "5000", 10);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📝 API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
