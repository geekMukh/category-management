
import Category from "../models/category.js"

/**
 * Fetches categories based on the provided parent ID, or returns top-level categories if no parent ID is provided.
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object to send the fetched categories.
 */
export const fetch = async (req, res) => {
    try {
        // Prepare the query object with a default condition for top-level categories.
        let queryObj = {
            parent_id: null
        }
        // If a parent ID is provided in the request body, adjust the query object accordingly.
        if (req.query.parentId) {
            queryObj.parent_id = req.query.parentId
        }
        // Fetch categories based on the constructed query object.
        let data = await Category.find(queryObj)

        // Send the fetched categories as a response with a success status.
        res.status(200).send({
            status: true,
            message: "Success",
            payload: data
        })

    } catch (error) {
        // Log and handle any errors that occur during the fetching process.
        console.log("Error in fetching categories ", error);
        // Return an internal server error response in case of any errors.
        return res.status(500).send({
            status: false,
            message: "Internal Server Error!"
        })
    }
}

/**
 * Creates a new category based on the provided data.
 * @param {Object} req - The request object containing category information.
 * @param {Object} res - The response object to send the result of the category creation.
 */
export const create = async (req, res) => {
    try {
        // Check if the category name is provided and is not an empty string.
        if (!req.body.cat_name || !req.body.cat_name.length) {
            // If category name is missing or empty, send a success response with an empty payload.
            return res.status(400).send({
                status: false,
                message: "No category name found",
                payload: {}
            })
        }

        // Prepare the object to create a new category.
        let createObj = {
            parent_id: null, // Default parent_id to null
            name: req.body.cat_name // Set the name of the category
        }

        // If a parent ID is provided in the request, set it in the create object.
        if (req.body.parentId) {
            createObj["parent_id"] = req.body.parentId
        }

        // Create a new instance of the Category model with the provided data.
        let model = new Category(createObj);

        // Save the new category to the database.
        await model.save()

        // Send a success response after successfully creating the category.
        res.status(200).send({
            status: true,
            message: "Success",
            payload: {}
        })

    } catch (error) {
        // Log and handle any errors that occur during the category creation process.
        console.log("Error in creating category ", error);
        // Return an internal server error response in case of any errors.
        return res.status(500).send({
            status: false,
            message: "Internal Server Error!"
        })
    }
}

/**
 * Deletes a category based on the provided category ID.
 * @param {Object} req - The request object containing the category ID.
 * @param {Object} res - The response object to send the result of the category deletion.
 */
export const deleteCategory = async (req, res) => {
    try {
        // Extract the category ID from the request parameters.
        const categoryId = req.params.id;

        // Check if the category ID is valid.
        if (!categoryId) {
            return res.status(400).send({
                status: false,
                message: "Category ID is missing."
            });
        }

        // Find the category in the database by its ID and remove it.
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        // Check if the category was found and deleted successfully.
        if (!deletedCategory) {
            return res.status(404).send({
                status: false,
                message: "Category not found."
            });
        }
        await Category.deleteMany( { parent_id: categoryId } )
        // Send a success response after successfully deleting the category.
        res.status(200).send({
            status: true,
            message: "Category deleted successfully.",
            payload: deletedCategory
        });
    } catch (error) {
        // Log and handle any errors that occur during the category deletion process.
        console.log("Error in deleting category ", error);
        // Return an internal server error response in case of any errors.
        return res.status(500).send({
            status: false,
            message: "Internal Server Error!"
        });
    }
};

/**
 * Updates the name of a category based on the provided category ID.
 * @param {Object} req - The request object containing the category ID and updated name.
 * @param {Object} res - The response object to send the result of the category update.
 */
export const updateCategory = async (req, res) => {
    try {
        // Extract the category ID from the request parameters.
        const categoryId = req.params.id;

        // Check if the category ID is valid.
        if (!categoryId) {
            return res.status(400).send({
                status: false,
                message: "Category ID is missing."
            });
        }

        // Extract the updated name from the request body.
        const updatedName = req.body.name;
        if (!updatedName || !updatedName.length) {
            return res.status(400).send({
                status: false,
                message: "Category name cannot be empty."
            });
        }

        // Find the category in the database by its ID and update its name.
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name: updatedName }, { new: true });

        // Check if the category was found and updated successfully.
        if (!updatedCategory) {
            return res.status(404).send({
                status: false,
                message: "Category not found."
            });
        }

        // Send a success response after successfully updating the category name.
        res.status(200).send({
            status: true,
            message: "Category name updated successfully.",
            payload: updatedCategory
        });
    } catch (error) {
        // Log and handle any errors that occur during the category update process.
        console.log("Error in updating category name ", error);
        // Return an internal server error response in case of any errors.
        return res.status(500).send({
            status: false,
            message: "Internal Server Error!"
        });
    }
};


// This function fetches all categories and organizes them into a tree structure
export const fetchAll = async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find().lean().exec();

        // Create a map to efficiently store categories by their IDs
        const categoryMap = new Map();

        // Iterate through each category
        categories.forEach(category => {
            // Initialize an empty array for children categories
            category.children = [];
            // Store the category in the map with its ID as the key
            categoryMap.set(category._id.toString(), category);
        });

        // Initialize the root of the category tree
        const tree = [];

        // Iterate through each category again
        categories.forEach(category => {
            // Get the parent ID of the category, or null if it has no parent
            const parentId = category.parent_id ? category.parent_id.toString() : null;
            if (parentId) {
                // If the category has a parent, try to find the parent category in the map
                const parentCategory = categoryMap.get(parentId);
                if (parentCategory) {
                    // If the parent category is found, add the current category as its child
                    parentCategory.children.push(category);
                } else {
                    // If the parent category is not found, handle orphaned categories by adding them to the root of the tree
                    tree.push(category);
                }
            } else {
                // If the category has no parent, add it to the root of the tree
                tree.push(category);
            }
        });

        // Return the category tree as a response
        return res.status(200).send({
            status: true,
            message: "Category fetched successfully.",
            payload: tree
        });
    } catch (error) {
        // If an error occurs during fetching or processing categories, return an internal server error response
        return res.status(500).send({
            status: false,
            message: "Internal Server Error!"
        });
    }
}

