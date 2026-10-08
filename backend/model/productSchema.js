import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Women", "Men", "Unisex"],
        default: "Women"
    },
    stock: {
        type: Number,
        required: true
    },
    images: [
        {
            type: String,
            default: ""
        }
    ],
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;