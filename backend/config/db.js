import mongoose from "mongoose"
import Product from "../model/productSchema.js"
import User from "../model/userSchema.js"
import bcrypt from "bcrypt"
import { fashionProducts } from "../seed.js"

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Warning: MONGO_URI environment variable is not defined.")
            return
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")

        // Auto-seed initial catalog if database has 0 products
        const count = await Product.countDocuments()
        if (count === 0) {
            console.log("Empty catalog detected. Seeding initial fashion items...")
            const prepared = fashionProducts.map((p) => ({
                ...p,
                status: "approved",
                images: p.images && p.images.length ? p.images : [p.image],
                image: p.image || (p.images && p.images[0]) || "",
            }))
            await Product.insertMany(prepared)
            console.log(`Seeded ${prepared.length} luxury fashion items with photos!`)
        }

        // Auto-ensure default admin account exists
        const adminUser = await User.findOne({ email: "admin@elora.com" })
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash("admin123", 10)
            await User.create({
                name: "Elena Rostova (Curator Admin)",
                email: "admin@elora.com",
                password: hashedPassword,
                role: "admin",
            })
            console.log("Created default admin user: admin@elora.com / admin123")
        }
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
    }
}

export default connectDB