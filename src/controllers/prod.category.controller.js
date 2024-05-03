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
    const prodCategoryResponse = await prodCategoryService.registerProdCategory(body, files[0].path);

    return res
      .status(201).json(
        new apiResponse(201, prodCategoryResponse, "Product category registered successfully" ));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

export { registerProdCategory };
