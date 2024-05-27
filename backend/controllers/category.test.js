import {
    fetch,
    create,
    deleteCategory,
    updateCategory,
    fetchAll
} from '../controllers/category.js';

import Category from '../models/category.js';

jest.mock('../models/category.js');

describe('Category Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetch', () => {
        it('should fetch categories based on parent ID', async () => {
            const mockReq = { query: { parentId: 'mockParentId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockCategories = [{ name: 'Mock Category' }];

            Category.find.mockResolvedValue(mockCategories);

            await fetch(mockReq, mockRes);

            expect(Category.find).toHaveBeenCalledWith({ parent_id: 'mockParentId' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: true,
                message: 'Success',
                payload: mockCategories
            });
        });

        it('should fetch top-level categories if no parent ID is provided', async () => {
            const mockReq = { query: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockCategories = [{ name: 'Mock Category' }];

            Category.find.mockResolvedValue(mockCategories);

            await fetch(mockReq, mockRes);

            expect(Category.find).toHaveBeenCalledWith({ parent_id: null });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: true,
                message: 'Success',
                payload: mockCategories
            });
        });

        it('should handle errors during fetching', async () => {
            const mockReq = { query: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockError = new Error('Mock error');

            Category.find.mockRejectedValue(mockError);

            await fetch(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: false,
                message: 'Internal Server Error!'
            });
        });
    });

    describe('create', () => {
        it('should create a new category successfully', async () => {
            const mockReq = { body: { cat_name: 'Mock Category' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockModel = { save: jest.fn() };

            Category.mockReturnValueOnce(mockModel);

            await create(mockReq, mockRes);

            expect(mockModel.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: true,
                message: 'Success',
                payload: {}
            });
        });

        it('should handle missing or empty category name', async () => {
            const mockReq = { body: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await create(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: false,
                message: 'No category name found',
                payload: {}
            });
        });

        it('should handle errors during category creation', async () => {
            const mockReq = { body: { cat_name: 'Mock Category' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockError = new Error('Mock error');

            Category.mockReturnValueOnce({ save: jest.fn().mockRejectedValue(mockError) });

            await create(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: false,
                message: 'Internal Server Error!'
            });
        });
    });

    describe('deleteCategory', () => {
        it('should delete a category successfully', async () => {
            const mockReq = { params: { id: 'mockCategoryId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            Category.findByIdAndDelete.mockResolvedValue({ _id: 'mockCategoryId' });

            await deleteCategory(mockReq, mockRes);

            expect(Category.findByIdAndDelete).toHaveBeenCalledWith('mockCategoryId');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: true,
                message: 'Category deleted successfully.',
                payload: { _id: 'mockCategoryId' }
            });
        });

        it('should handle missing category ID', async () => {
            const mockReq = { params: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await deleteCategory(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: false,
                message: 'Category ID is missing.'
            });
        });

        it('should handle errors during category deletion', async () => {
            const mockReq = { params: { id: 'mockCategoryId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockError = new Error('Mock error');

            Category.findByIdAndDelete.mockRejectedValue(mockError);

            await deleteCategory(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: false,
                message: 'Internal Server Error!'
            });
        });
    });

    // Test cases for updateCategory function
describe('updateCategory function', () => {
    it('should update a category name successfully', async () => {
        // Mock request parameters
        const mockCategoryId = 'mockCategoryId';
        const mockUpdatedName = 'Updated Category Name';
        const mockReq = {
            params: { id: mockCategoryId },
            body: { name: mockUpdatedName }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        // Mock updated category data
        const updatedCategory = { _id: mockCategoryId, name: mockUpdatedName };
        // Mock Category.findByIdAndUpdate() to resolve with updated category
        Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

        // Call the updateCategory function
        await updateCategory(mockReq, mockRes);

        // Expect status and send functions to be called with appropriate arguments
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith({
            status: true,
            message: "Category name updated successfully.",
            payload: updatedCategory
        });
    });

    it('should handle missing category ID', async () => {
        // Mock request parameters with missing category ID
        const mockReq = {
            params: {},
            body: { name: 'Updated Category Name' }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Call the updateCategory function
        await updateCategory(mockReq, mockRes);

        // Expect status and send functions to be called with appropriate arguments
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
            status: false,
            message: "Category ID is missing."
        });
    });

    it('should handle missing category name', async () => {
        // Mock request parameters with missing category name
        const mockReq = {
            params: { id: 'mockCategoryId' },
            body: {}
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Call the updateCategory function
        await updateCategory(mockReq, mockRes);

        // Expect status and send functions to be called with appropriate arguments
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
            status: false,
            message: "Category name cannot be empty."
        });
    });

    it('should handle errors when updating category', async () => {
        // Mock request parameters
        const mockCategoryId = 'mockCategoryId';
        const mockUpdatedName = 'Updated Category Name';
        const mockReq = {
            params: { id: mockCategoryId },
            body: { name: mockUpdatedName }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const mockError = new Error('Mock error');
        // Mock Category.findByIdAndUpdate() to reject with an error
        Category.findByIdAndUpdate.mockRejectedValue(mockError);

        // Call the updateCategory function
        await updateCategory(mockReq, mockRes);

        // Expect status and send functions to be called with appropriate arguments
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({
            status: false,
            message: "Internal Server Error!"
        });
    });
});

});