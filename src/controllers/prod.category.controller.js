import prodCategoryService from "../services/prod.category.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register a new Product Category
const registerProdCategory = asyncHandler(async (req, res) => {
  try {
    const { body, files } = req;
    const response = await prodCategoryService.registerProdCategory(body, files[0].path);
    return handleResponse(res, 201, response, "Product category registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update product category details
const updateProdCategory = asyncHandler(async (req, res) => {
  try {
    const { body, params, files } = req;
    console.log("files", files?.[0]?.path);
    const response =  await prodCategoryService.updateProdCategory(body, params.id, files?.[0]?.path)
    return handleResponse(res, 202, response, "Product category  updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete Product Category, if its reference is not in other documents(tables)
const deleteProdCategory = async (req, res) => {
  try {
    const { params } = req;
    const response = await prodCategoryService.deleteProdCategory( params.id );
    return handleResponse(res, 200, response, "Product Category deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

//Update User Info
const getAllProdCategories = asyncHandler(async (req, res) => {
  try {
    const response = await prodCategoryService.getAllProdCategories();
    return handleResponse(res, 200, response, "Product Category(ies) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }

});

//Get product category by Id
const getProdCategory = asyncHandler(async (req, res) => {
  try {
    const { params } = req;
    const response = await prodCategoryService.getProdCategory(params.id);
    return handleResponse(res, 200, response, "Product Category fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export { 
  registerProdCategory,
  updateProdCategory,
  getAllProdCategories,
  deleteProdCategory,
  getProdCategory,
};
