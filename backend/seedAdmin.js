import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./model/userSchema.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    const existing = await User.findOne({ email: "adminmax@gmail.com" });
    const hashedPassword = await bcrypt.hash("1234", 10);
    if (!existing) {
      await User.create({
        name: "Admin Max",
        email: "adminmax@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Created admin user: adminmax@gmail.com / 1234");
    } else {
      existing.password = hashedPassword;
      existing.role = "admin";
      await existing.save();
      console.log("Admin account verified: adminmax@gmail.com");
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error("Admin seed error:", err);
    process.exit(1);
  }
};

createAdmin();
