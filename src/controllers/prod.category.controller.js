import prodCategoryService from "../services/prod.category.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Product Category
const registerProdCategory = asyncHandler(async (req, res) => {
  //TODO: Register a new Product Category
  try {
    const { body, files } = req;
   
    // Extract Category details like Category Name, Description etc
    const response = await prodCategoryService.registerProdCategory(body, files[0].path);

    return res
      .status(201).json(
        new apiResponse(201, response, "Product category registered successfully" ));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Update product category details
const updateProdCategory = asyncHandler(async (req, res) => {
  //TODO: Update User information
  let response;
  try {
    const { body, params, files } = req;
    console.log("files", files);
    const response =  await prodCategoryService.updateProdCategory(body, params.id, files?.[0]?.path)
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
const getAllProdCategories = asyncHandler(async (req, res) => {
  try {
    const prodCategoriesResponse = await prodCategoryService.getAllProdCategories();
    return res
    .status(200).json(
      new apiResponse(200, prodCategoriesResponse, "Product Category(ies) fetched successfully"));
  } catch (error) {
    return res
    .status(500).json(
      new apiError({ statusCode: error.statusCode, message: error.message })
    );
  };
});

//Delete product category
const deleteProdCategory = async (req, res) => {
  //TODO: Delete Product Category from DB, if its reference is not in other documents(tables)
  try {
    const { params } = req;
    const deleteProdCategoryResponse = await prodCategoryService.deleteProdCategory( params.id );
    return res.status(200)
      .json(new apiResponse(200, deleteProdCategoryResponse, "Product category deleted successfully"));
    
  } catch (error) {
    return res.status(500)
    .json(new apiError({ statusCode: error.statusCode, message: error.message })
    );

  }
};

//Get product category by Id
const getProdCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const prodCategoryResponse = await prodCategoryService.getProdCategory(params.id);
    return res
      .status(200).json(
        new apiResponse(200, prodCategoryResponse, "Product Category fetched successfully"));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message })
      );
  }
});

export { 
  registerProdCategory,
  updateProdCategory,
  getAllProdCategories,
  deleteProdCategory,
  getProdCategory,
};
