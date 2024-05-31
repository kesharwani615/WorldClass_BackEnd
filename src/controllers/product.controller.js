import productService from "../services/product.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Product
const registerProduct = asyncHandler(async (req, res) => {
  //TODO: Register a new Product
  try {
    const response = await productService.registerProduct(req.body, req.files?.[0]?.path);
    return handleResponse(res, 201, response, "Product registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update product details
const updateProduct = asyncHandler(async (req, res) => {
  //TODO: Update Product details
  try {
    const response =  await productService.updateProduct(req.body, req.params.id, req.files?.[0]?.path)
    return handleResponse(res, 202, response, "Product updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete product
const deleteProduct = async (req, res) => {
  try {
    const response = await productService.deleteProduct( req.params.id );
    return handleResponse(res, 200, response, "Product deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

//Get All Products
const getProducts = asyncHandler(async (req, res) => {
  try {
    const response = await productService.getProducts();
    return handleResponse(res, 200, response, "Product(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get product by Id
const getProductById = asyncHandler(async (req, res) => {
  try {
    const response = await productService.getProductById(req.params.id);
    return handleResponse(res, 200, response, "Product fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get All Products by Sub Category
const getProductsBySubCategory = asyncHandler(async (req, res) => {
  try {
    const response = await productService.getProductsBySubCategory(req.params.id);
    return handleResponse(res, 200, response, "Product(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get Products with Category and Sub Category
const getProductsByCategoryAndSubCategory = asyncHandler(async (req, res) => {
  try {
    const response = await productService.getProductsByCategoryAndSubCategory();
    return handleResponse(res, 200, response, "Product(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get Product Count
const getProductCount = asyncHandler(async (req, res) => {
  try {
    const response = await productService.getProductCount();
    return handleResponse(res, 200, response, "Count of Product(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export { 
  registerProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductsBySubCategory,
  getProductsByCategoryAndSubCategory,
  getProductCount,
 };
