import { bootstrapCategories } from "./categoryBootstrap";

export const bootstrap = async (): Promise<void> => {
  try {
    console.log("Starting application bootstrap...");

    // Bootstrap categories
    await bootstrapCategories();

    console.log("Application bootstrap completed successfully");
  } catch (error) {
    console.error("Error during application bootstrap:", error);
    throw error;
  }
};
