import productService from "../services/product.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Product Sub Category
const registerProduct = asyncHandler(async (req, res) => {
  //TODO: Register a new Product
  try {
    const { body, files } = req;
    // Extract product details like product Name, Description etc
    const productResponse = await productService.registerProduct(body, files[0].path);

    return res
      .status(201).json(
        new apiResponse(201, productResponse, "Product registered successfully" ));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

export { registerProduct };
