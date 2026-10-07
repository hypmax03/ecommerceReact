import cloudinary from "../config/cloudinary.js";
import Product from "../model/productSchema.js";
import { fashionProducts } from "../seed.js";

export const seedFashionProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(fashionProducts);
    res.status(200).json({
      message: "Fashion dress catalog seeded successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to seed products",
      error: error.message,
    });
  }
};

export const productController = async (req, res) => {
  try {
    const { description, stock, gender, category, price, name } = req.body;
    const image = req.file;
    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
      {
        folder: "products",
      },
    );
    const product = {
      name,
      price,
      description,
      category,
      stock,
      image: result.secure_url,
    };

    let newProduct = await Product.create(product);
    res.status(201).json({
      message: "Product added",
      newProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    let products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};
