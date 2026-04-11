import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`);
    console.log("✅ Database Connected");
  } catch (error) {
    console.log("DB Connection Error:", error.message);
  }
};

export default connectDB;