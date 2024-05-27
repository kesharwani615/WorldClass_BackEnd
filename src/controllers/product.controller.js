import productService from "../services/product.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Product
const registerProduct = asyncHandler(async (req, res) => {
  //TODO: Register a new Product
  try {
    const { body, files } = req;
    // Extract product details like product Name, Description etc
    const response = await productService.registerProduct(body, files[0].path);
    return handleResponse(res, 201, response, "Product registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update product details
const updateProduct = asyncHandler(async (req, res) => {
  //TODO: Update Product details
  try {
    const { body, params, files } = req;
    const response =  await productService.updateProduct(body, params.id, files?.[0]?.path)
    return handleResponse(res, 202, response, "Product updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete product
const deleteProduct = async (req, res) => {
  //TODO: Delete Product from DB
  try {
    const { params } = req;
    const response = await productService.deleteProduct( params.id );
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
    const { params } = req;
    const response = await productService.getProductById(params.id);
    return handleResponse(res, 200, response, "Product fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get All Products by Sub Category
const getProductsBySubCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await productService.getProductsBySubCategory(params.id);
    return handleResponse(res, 200, response, "Product(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

const getProductsWithSubCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await productService.getProductsBySubCategory(params.id);
    return handleResponse(res, 200, response, "Product(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get All Products by Sub Category
const getProductsByCategorySubCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await productService.getProductsBySubCategory(params.id);
    return handleResponse(res, 200, response, "Product(s) fetched successfully");
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
  getProductsByCategorySubCategory,
 };
