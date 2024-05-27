
import express from "express";

// Import controller functions for category operations
import {fetch as getCategory,fetchAll as getAllcategory, create as createCategory, deleteCategory, updateCategory} from "../controllers/category.js"

// Create an instance of the Express router
const router = express.Router();

// Define routes for category operations with corresponding controller functions

// Route to fetch categories by parent id
router.get('/fetch-categories', getCategory);

// Route to fetch categories
router.get('/fetch-all-categories', getAllcategory);

// Route to create a new category
router.post('/create-category',createCategory );

// Route to delete a category
router.delete('/delete-category/:id',deleteCategory );

// Route to update a category
router.put('/update-category/:id', updateCategory);



export default router;