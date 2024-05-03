import mongoose, { Schema } from "mongoose";

const prodCategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category Name is required"],
      trim: true,
      index: true,
    },
    categoryDescription: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ProductCategory = mongoose.model("ProductCategory", prodCategorySchema);
