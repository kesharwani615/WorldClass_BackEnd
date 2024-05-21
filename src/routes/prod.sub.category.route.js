import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { deleteProductSubCategory, getAllProductSubCategories, getProductSubCategory, registerProdSubCategory, updateProductSubCategory } from "../controllers/prod.sub.category.controller.js";

const subCategoryRouter = Router();

// Register new User
subCategoryRouter.post("/register", upload("prodSubCategory").array("subCategoryImage", 1), registerProdSubCategory);

//Update Product Category
subCategoryRouter.patch("/update/:id", upload('prodSubCategory').array("subCategoryImage", 1), updateProductSubCategory);

//Delete Product Sub Category permanently
subCategoryRouter.delete("/delete/:id", deleteProductSubCategory)

//Get Product Category
subCategoryRouter.get("/get-sub-category/:id", getProductSubCategory);

//Get all Product Sub Categories
subCategoryRouter.get("/get-sub-categories", getAllProductSubCategories);

export default subCategoryRouter;  
