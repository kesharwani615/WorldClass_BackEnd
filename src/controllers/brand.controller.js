import brandService from "../services/brand.service.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Register a new Brand
const registerBrand = asyncHandler(async (req, res) => {
  try {
    const response = await brandService.registerBrand(req.body, req.files?.[0]?.path);
    return handleResponse(res, 201, response, "Brand registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Update Brand details
const updateBrand = asyncHandler(async (req, res) => {
  try {
    const response =  await brandService.updateBrand(req.params.id, req.body, req.files?.[0]?.path)
    return handleResponse(res, 202, response, "Brand updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const response = await brandService.deleteBrand( req.params.id );
    return handleResponse(res, 200, response, "Brand deleted successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get all Brands
const getBrands = asyncHandler(async (req, res) => {
  try {
    const response = await brandService.getBrands();
    return handleResponse(res, 200, response, "Brand(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get Brand by Id
const getBrand = asyncHandler(async (req, res) => {
  try {
    const response = await brandService.getBrand(req.params.id);
    return handleResponse(res, 200, response, "Brand fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

//Get Brands Count
const getBrandsCount = asyncHandler(async (req, res) => {
  try {
    const response = await brandService.getBrandsCount();
    return handleResponse(res, 200, response, "Count of brand(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export {
    registerBrand,
    updateBrand,
    deleteBrand,
    getBrands,
    getBrand,
    getBrandsCount,
  };
  