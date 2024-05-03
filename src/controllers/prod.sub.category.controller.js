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
    const prodSubCategoryResponse = await prodSubCategoryService.registerProdSubCategory(body, files[0].path);

    return res
      .status(201).json(
        new apiResponse(201, prodSubCategoryResponse, "Product sub category registered successfully" ));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

export { registerProdSubCategory };
