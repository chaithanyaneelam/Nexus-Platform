import mongoose from "mongoose";

const normalizePaymentIndexes = async (): Promise<void> => {
  try {
    const paymentsCollection = mongoose.connection.collection("payments");
    const indexes = await paymentsCollection.indexes();

    const staleUniqueIndexes = indexes.filter((index) => {
      if (!index.unique || !index.key) {
        return false;
      }

      const keyFields = Object.keys(index.key);
      return (
        keyFields.length === 1 &&
        (keyFields[0] === "transactionId" || keyFields[0] === "utrNumber")
      );
    });

    for (const index of staleUniqueIndexes) {
      if (index.name) {
        await paymentsCollection.dropIndex(index.name);
        console.log(`ℹ️ Dropped legacy payment index: ${index.name}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`⚠️ Payment index normalization skipped: ${error.message}`);
      return;
    }
    console.warn("⚠️ Payment index normalization skipped due to unknown error");
  }
};

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoURI);

    await normalizePaymentIndexes();

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    } else {
      console.error("❌ MongoDB Connection Error: Unknown error");
    }
    process.exit(1);
  }
};

export default connectDB;
