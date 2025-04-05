const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// Search books by title, author, language, or book ID
router.get("/", async (req, res) => {
    try {
        const { query } = req.query;

        console.log("📢 Received Search Request:", query);

        if (!query) {
            console.log("❌ No search query provided!");
            return res.status(400).json({ message: "Search query is required" });
        }

        let books;

        // Check if query is a valid MongoDB ObjectId (24-character hex string)
        if (query.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("🔍 Searching by Book ID...");
            books = await Book.find({ _id: query });
        } else {
            console.log("🔍 Searching by title, author, or language...");
            books = await Book.find({
                $or: [
                    { title: { $regex: query, $options: "i" } }, 
                    { author: { $regex: query, $options: "i" } }, 
                    { language: { $regex: query, $options: "i" } }
                ],
            });
        }

        console.log("✅ Matching Books:", books);

        res.json(books);
    } catch (error) {
        console.error("🚨 Search API Error:", error.message);
        res.status(500).json({ message: "Error searching books", error: error.message });
    }
});

module.exports = router;
