import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { 
    deleteProdCategory,
    getAllProdCategories, 
    getProdCategory, 
    getProdCategoryCount, 
    registerProdCategory, 
    updateProdCategory } from "../controllers/prod.category.controller.js";

const categoryRouter = Router();

// Register new Product Category
categoryRouter.post("/register", upload("prodCategory").array("categoryImage", 1), registerProdCategory);
//Update Product Category
categoryRouter.patch("/update/:id", upload('prodCategory').array("categoryImage", 1),  updateProdCategory);
//Get all Product Categories
categoryRouter.get("/get-categories", getAllProdCategories);
//Delete Product Category permanently
categoryRouter.delete("/delete/:id", deleteProdCategory)
//Get Product Category
categoryRouter.get("/get-category/:id", getProdCategory);
//Get Product Category count
categoryRouter.get("/category-count", getProdCategoryCount);

export default categoryRouter;
