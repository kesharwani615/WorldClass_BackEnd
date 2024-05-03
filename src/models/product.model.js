import mongoose, { Schema } from "mongoose";
import { ProductCategory } from "./product.category.model.js";

const productSchema = new Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubCategory",
    },
    productName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
      index: true,
    },
    productDescription: {
      type: String,
    },
    productImage: {
      type: String,
      required: true,
    },
    storage: {
      type: String,
    },
    packSize: {
      type: String,
    },
    cartonSize: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
