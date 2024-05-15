import productService from "../services/product.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register Product
const registerProduct = asyncHandler(async (req, res) => {
  //TODO: Register a new Product
  try {
    const { body, files } = req;
    // Extract product details like product Name, Description etc
    const response = await productService.registerProduct(body, files[0].path);

    return res
      .status(201).json(
        new apiResponse(201, response, "Product registered successfully" ));
  } catch (error) {
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Update product details
const updateProduct = asyncHandler(async (req, res) => {
  //TODO: Update Product details
  try {
    const { body, params, files } = req;
    const response =  await productService.updateProduct(body, params.id, files[0].path)
    return res
      .status(200).json(
        new apiResponse(200, response, "Product details updated successfully", true));
  } catch (error) {
    // Send error response if any error occurs
    return res
      .status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Delete product
const deleteProduct = async (req, res) => {
  //TODO: Delete Product from DB
  try {
    const { params } = req;
    const response = await productService.deleteProduct( params.id );
    return res.status(200)
      .json(new apiResponse(200, response, "Product deleted successfully"));
    
  } catch (error) {
    return res.status(500)
    .json(new apiError({ statusCode: error.statusCode, message: error.message })
    );
  }
};

const getProducts = asyncHandler(async (req, res) => {
  try {
    const response = await productService.getProducts();
    return res
    .status(200).json(
      new apiResponse(200, response, "Product(s) fetched successfully"));
  } catch (error) {
    return res
    .status(500).json(
      new apiError({ statusCode: error.statusCode, message: error.message })
    );
  };
});

export { 
  registerProduct,
  updateProduct,
  deleteProduct,
  getProducts
 };
