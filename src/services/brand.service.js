import { deleteImage, validateObjectId, convertToObjectId } from "../helpers/helper.methods.js";
import { Brand } from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";

// Register a new Brand
const registerBrand = async (body, brandLogoPath) => {
  try {
    if (!brandLogoPath || !brandLogoPath.length) {
      throw new apiError(400, "Brand Logo is required");
    }

    const { brandType, brandName, brandDescription } = body;

    if ([brandType, brandName, brandDescription].some((field) => field?.trim() === "" )) {
      throw new apiError(400, "All fields are required");
    }

    const findBrand = await Brand.findOne({ brandName });

    if (findBrand) {
      throw new apiError(409, "Brand name is already exists.");
    }

    const brand = await Brand.create({
      brandType,
      brandName,
      brandDescription,
      brandLogo: brandLogoPath,
    });

    return brand;
  } catch (error) {
    if (brandLogoPath) {
      deleteImage(brandLogoPath);
    }
    throw error;
  }
};

//Update Brand
const updateBrand = async (brandId, body, brandLogoPath) => {
  try {
    const brandIdObject = convertToObjectId(brandId);
    if (!brandIdObject) {
      throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
    }
    
    const { brandType, brandName, brandDescription } = body;

    if ([brandType, brandName, brandDescription].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const findBrand = await Brand.findOne({_id: brandIdObject});
    if (!findBrand) {
      throw new apiError(404, "Brand Not Found");
    }

    if (brandLogoPath) {
      deleteImage(findBrand.brandLogo);
      findBrand.brandLogo = brandLogoPath;
    }

    Object.assign(findBrand, body);

    const updatedBrand = await findBrand.save();

    return updatedBrand;
   } catch (error) {
    if (brandLogoPath) {
      deleteImage(brandLogoPath);
    }
    throw error;
   }
};

//Delete Brand
const deleteBrand = async (brandId) => {
  const brandIdObject = convertToObjectId(brandId);
  if (!brandIdObject) {
    throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
  }

  const brandToDelete = await Brand.findOne({_id: brandIdObject});
  if (!brandToDelete) {
    throw new apiError(404, "Brand not found"); 
  }
  
  const imageToDelete = brandToDelete.brandLogo;

  const result = await Brand.deleteOne({_id: brandIdObject});

  if (!result.deletedCount === 0) {
    throw new apiError(404, "Brand not found"); 
  } 
    
  if (imageToDelete) {
    deleteImage(imageToDelete);
  }

  return brandToDelete; 
};

// Get all Brands
const getBrands = async () => {
  const brands = await Brand.find({});
  if (!brands.length) {
    throw new Error(400, "Brand(s) not found");
  }
  return brands;
};

// Get Brand by Id
const getBrand = async (brandId) => {
  const brandIdObject = convertToObjectId(brandId);
  if (!brandIdObject) {
    throw new apiError(400, "Invalid ID"); // Stop execution if the ID format is invalid
  }

  const brand = await Brand.findOne({_id: brandIdObject});
  if (!brand) {
    throw new apiError(400, "Brand not found");
  }

  return brand;
};

//Get Brands Count
const getBrandsCount = async () => {
  const brands = await Brand.countDocuments();
  if (!brands) {
    throw new apiError(404, "No brand(s) found");
  }

  return brands;
};

export default {
  registerBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  getBrand,
  getBrandsCount,
};
