import prodSubCategoryService from "../services/prod.sub.category.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Product Sub Category
const registerProdSubCategory = asyncHandler(async (req, res) => {
  //TODO: Register a new Product Sub Category
  try {
    const { body, files } = req;
    // Extract Category details like Category Name, Description etc
    const response = await prodSubCategoryService.registerProdSubCategory(body, files[0].path);

    return res
      .status(201).json(
        new apiResponse(201, response, "Product sub category registered successfully" ));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Update product category details
const updateProductSubCategory = asyncHandler(async (req, res) => {
  //TODO: Update User information
  let response;
  try {
    const { body, params, files } = req;
    console.log("files", files);
    const response =  await prodSubCategoryService.updateProductSubCategory(body, params.id, files[0].path)
    return res
      .status(200).json(
        new apiResponse(200, response, "User's info updated successfully", true));
  } catch (error) {
    // Send error response if any error occurs
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Update User Info
const getAllProductSubCategories = asyncHandler(async (req, res) => {
  try {
    const response = await prodSubCategoryService.getAllSubProdCategories();
    return res
    .status(200).json(
      new apiResponse(200, response, "Product Sub Category(ies) fetched successfully"));
  } catch (error) {
    return res
    .status(500).json(
      new apiError({ statusCode: error.statusCode, message: error.message })
    );
  };
});

//Delete product sub category
const deleteProductSubCategory = async (req, res) => {
  //TODO: Delete Product Sub Category from DB, if its reference is not in other documents(tables)
  try {
    const { params } = req;
    const response = await prodSubCategoryService.deleteProductSubCategory( params.id );
    return res.status(200)
      .json(new apiResponse(200, response, "Product sub category deleted successfully"));
    
  } catch (error) {
    return res.status(500)
    .json(new apiError({ statusCode: error.statusCode, message: error.message })
    );

  }
};

//Get product sub category by Id
const getProductSubCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await prodSubCategoryService.getProductSubCategory(params.id);
    return res
      .status(200).json(
        new apiResponse(200, response, "Product Sub Category fetched successfully"));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

export { 
  registerProdSubCategory, 
  updateProductSubCategory,
  deleteProductSubCategory,
  getAllProductSubCategories,
  getProductSubCategory,
 };
