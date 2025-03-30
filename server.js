    const express = require("express");
    const cors = require("cors");

    const app = express();
    const PORT = 5000;

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Sample product list with categories
    let products = [
        { id: 1, name: "Ring", price: 260, category: "Accessories" },
        { id: 2, name: "Chain", price: 350, category: "Accessories" },
        { id: 3, name: "Basket", price: 150, category: "Home" },
        { id: 4, name: "Watch", price: 1200, category: "Watches" },
        { id: 5, name: "Bracelet", price: 180, category: "Accessories" },
        { id: 6, name: "Necklace", price: 400, category: "Accessories" },
        { id: 7, name: "Earrings", price: 220, category: "Accessories" },
        { id: 8, name: "Belt", price: 500, category: "Clothing" },
        { id: 9, name: "Sunglasses", price: 600, category: "Accessories" },
        { id: 10, name: "Wallet", price: 300, category: "Accessories" },
        { id: 11, name: "Backpack", price: 700, category: "Bags" },
        { id: 12, name: "Shoes", price: 900, category: "Footwear" },
        { id: 13, name: "Laptop Bag", price: 1200, category: "Bags" },
        { id: 14, name: "T-Shirt", price: 400, category: "Clothing" },
        { id: 15, name: "Jeans", price: 1000, category: "Clothing" },
        { id: 16, name: "Jacket", price: 2500, category: "Clothing" },
        { id: 17, name: "Perfume", price: 1500, category: "Beauty" },
        { id: 18, name: "Handbag", price: 3500, category: "Bags" },
        { id: 19, name: "Scarf", price: 550, category: "Clothing" },
        { id: 20, name: "Cap", price: 450, category: "Clothing" },
        { id: 21, name: "Socks", price: 200, category: "Clothing" },
        { id: 22, name: "Gloves", price: 600, category: "Clothing" },
        { id: 23, name: "Tie", price: 700, category: "Clothing" },
        { id: 24, name: "Belt", price: 800, category: "Clothing" },
        { id: 25, name: "Suit", price: 4500, category: "Clothing" },
        { id: 26, name: "Sweater", price: 1800, category: "Clothing" },
        { id: 27, name: "Shoes", price: 2200, category: "Footwear" },
        { id: 28, name: "Sports Watch", price: 3000, category: "Watches" },
        { id: 29, name: "Smart Watch", price: 5000, category: "Watches" },
        { id: 30, name: "Headphones", price: 3200, category: "Electronics" },
    ];

    // API endpoint to get products (with optional category filtering)
    app.get("/api/products", (req, res) => {
        const { category } = req.query;

        if (category && category !== "All") {
            const filteredProducts = products.filter((product) => product.category === category);
            return res.json(filteredProducts);
        }

        res.json(products);
    });

    // API endpoint to get all categories
    app.get("/api/categories", (req, res) => {
        const uniqueCategories = ["All", ...new Set(products.map((product) => product.category))];
        res.json(uniqueCategories);
    });
    app.post("/api/products", (req, res) => {
        const { name, price, category } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }
    
        const newProduct = {
            id: products.length + 1,
            name,
            price,
            category
        };
    
        products.push(newProduct);
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    });
    

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    app.delete("/api/products/:id", (req, res) => {
        const { id } = req.params;
        const index = products.findIndex(product => product.id == id);
    
        if (index !== -1) {
            products.splice(index, 1);
            res.json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    });
    app.put("/api/products/:id", (req, res) => {
        const { id } = req.params;
        const { name, price, category } = req.body;
    
        const productIndex = products.findIndex((product) => product.id == id);
    
        if (productIndex !== -1) {
            products[productIndex] = { 
                id: Number(id), 
                name, 
                price: Number(price), // Ensure price is stored as a number
                category 
            };
    
            res.json({ message: "Product updated successfully", product: products[productIndex] });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    });
    