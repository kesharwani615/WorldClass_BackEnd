import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  deleteBrand,
  getBrand,
  getBrands,
  getBrandsCount,
  registerBrand,
  updateBrand,
} from "../controllers/brand.controller.js"

const brandRouter = Router();

// Register a new Brand
brandRouter.post("/register", upload("brands").array("brandLogo", 1), registerBrand);
//Update Brand
brandRouter.patch("/update/:id", upload('brands').array("brandLogo", 1),  updateBrand);
//Delete Brand permanently
brandRouter.delete("/delete/:id", deleteBrand);
//Get all Brands
brandRouter.get("/get-brands", getBrands);
//Get Brand by Id
brandRouter.get("/get-brand/:id", getBrand);
//Get brands count
brandRouter.get("/brand-count", getBrandsCount);

export default brandRouter;  