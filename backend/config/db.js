import mongoose from "mongoose"

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Warning: MONGO_URI environment variable is not defined.")
            return
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
    }
}

export default connectDB