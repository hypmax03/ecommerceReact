import mongoose from "mongoose"
import Product from "../model/productSchema.js"
import { fashionProducts } from "../seed.js"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected")
        
        const count = await Product.countDocuments()
        if (count === 0) {
            await Product.insertMany(fashionProducts)
            console.log(`Auto-seeded ${fashionProducts.length} fashion dresses into database.`)
        }
    } catch (error) {
        console.log("DB connection error:", error)
    }
}

export default connectDB