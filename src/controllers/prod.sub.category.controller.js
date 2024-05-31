import prodSubCategoryService from "../services/prod.sub.category.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register a new Product Sub Category
const registerProdSubCategory = asyncHandler(async (req, res) => {
  try {
    const response = await prodSubCategoryService.registerProdSubCategory(req.body, req.files?.[0]?.path);
    return handleResponse(res, 201, response, "Product sub category registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update product category details
const updateProductSubCategory = asyncHandler(async (req, res) => {
  //TODO: Update User information
  try {
    const response =  await prodSubCategoryService.updateProductSubCategory(req.body, req.params.id, req.files?.[0]?.path)
    return handleResponse(res, 202, response, "Product sub category updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update User Info
const getAllProductSubCategories = asyncHandler(async (req, res) => {
  try {
    const response = await prodSubCategoryService.getAllProductSubCategories();
    return handleResponse(res, 200, response, "Product sub category(ies) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete product sub category
const deleteProductSubCategory = asyncHandler(async (req, res) => {
   try {
    const response = await prodSubCategoryService.deleteProductSubCategory( req.params.id );
    return handleResponse(res, 200, response, "Product sub category deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get product sub category by Id
const getProductSubCategory = asyncHandler(async (req, res) => {
  try {
    const response = await prodSubCategoryService.getProductSubCategory(req.params.id);
    return handleResponse(res, 200, response, "Product sub category fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get Product Sub Category Count
const getProductSubCategoryCount = asyncHandler(async (req, res) => {
  try {
    const response = await prodSubCategoryService.getProductSubCategoryCount();
    return handleResponse(res, 200, response, "Count of Product Sub Category(ies) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export { 
  registerProdSubCategory, 
  updateProductSubCategory,
  deleteProductSubCategory,
  getAllProductSubCategories,
  getProductSubCategory,
  getProductSubCategoryCount
 };
