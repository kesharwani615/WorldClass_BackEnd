import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { 
    deleteProdCategory,
    getAllProdCategories, 
    getProdCategory, 
    registerProdCategory, 
    updateProdCategory } from "../controllers/prod.category.controller.js";

const category_route = Router();

// Register new Product Category
category_route.post("/register", upload("prodCategory").array("categoryImage", 1), registerProdCategory);

//Update Product Category
category_route.patch("/update/:id", upload('prodCategory').array("categoryImage", 1),  updateProdCategory);

//Get all Product Categories
category_route.get("/get-categories", getAllProdCategories);

//Delete Product Category permanently
category_route.delete("/delete/:id", deleteProdCategory)

//Get Product Category
category_route.get("/get-category/:id", getProdCategory);

export default category_route;
