const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/products_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Product Schema using Mongoose
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

// Get all products (optionally filtered by category)
app.get("/api/products", async (req, res) => {
  const { category } = req.query;

  try {
    let products;
    if (category && category !== "All") {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get unique categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(["All", ...categories]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  const { name, price, category, quantity } = req.body;

  if (!name || !price || !category || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newProduct = new Product({ name, price, category, quantity });
    await newProduct.save();
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update a product by ID
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category, quantity } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category, quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product by ID
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
