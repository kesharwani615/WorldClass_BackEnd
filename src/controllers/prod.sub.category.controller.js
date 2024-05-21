import prodSubCategoryService from "../services/prod.sub.category.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register a new Product Sub Category
const registerProdSubCategory = asyncHandler(async (req, res) => {
  try {
    const { body, files } = req;
    const response = await prodSubCategoryService.registerProdSubCategory(body, files?.[0]?.path);
    return handleResponse(res, 201, response, "Product sub category registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update product category details
const updateProductSubCategory = asyncHandler(async (req, res) => {
  //TODO: Update User information
  try {
    const { body, params, files } = req;
    console.log("files", files);
    const response =  await prodSubCategoryService.updateProductSubCategory(body, params.id, files?.[0]?.path)
    return handleResponse(res, 202, response, "Product sub category updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update User Info
const getAllProductSubCategories = asyncHandler(async (req, res) => {
  try {
    const response = await prodSubCategoryService.getAllSubProdCategories();
    return handleResponse(res, 200, response, "Product sub category(ies) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete product sub category
const deleteProductSubCategory = asyncHandler(async (req, res) => {
  //TODO: Delete Product Sub Category from DB, if its reference is not in other documents(tables)
  try {
    const { params } = req;
    const response = await prodSubCategoryService.deleteProductSubCategory( params.id );
    return handleResponse(res, 200, response, "Product sub category deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get product sub category by Id
const getProductSubCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await prodSubCategoryService.getProductSubCategory(params.id);
    return handleResponse(res, 200, response, "Product sub category fetched successfully");
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
 };
