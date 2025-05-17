import cron from "node-cron";
import { RecurringTransactionService } from "../services/recurringTransactionService";

// Run every day at midnight
export const startRecurringTransactionJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Starting recurring transaction processing...");
      await RecurringTransactionService.processRecurringCategories();
      console.log("Recurring transaction processing completed");
    } catch (error) {
      console.error("Error processing recurring transactions:", error);
    }
  });
};
