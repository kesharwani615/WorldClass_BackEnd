import mongoose, { Schema } from "mongoose";
import { ProductCategory } from "./product.category.model.js";

const productSchema = new Schema(
  {
    prodName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
      index: true,
    },
    prodDescription: {
        type: String,
    },
    prodPicture: {
        type: String,
        required: true,
    },
    prodCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
