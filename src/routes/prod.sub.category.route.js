import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { deleteProductSubCategory, getAllProductSubCategories, getProductSubCategory, registerProdSubCategory, updateProductSubCategory } from "../controllers/prod.sub.category.controller.js";

const sub_category_route = Router();

// Register new User
sub_category_route.post("/register", upload("prodSubCategory").array("subCategoryImage", 1), registerProdSubCategory);

//Update Product Category
sub_category_route.patch("/update/:id", upload('prodSubCategory').array("subCategoryImage", 1), updateProductSubCategory);

//Delete Product Sub Category permanently
sub_category_route.delete("/delete/:id", deleteProductSubCategory)

//Get Product Category
sub_category_route.get("/get-sub-category/:id", getProductSubCategory);

//Get all Product Sub Categories
sub_category_route.get("/get-sub-categories", getAllProductSubCategories);

export default sub_category_route;  
