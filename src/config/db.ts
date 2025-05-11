import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err instanceof Error ? err.message : 'Unknown error');
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; 