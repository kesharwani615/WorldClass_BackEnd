import mongoose, { Schema } from "mongoose";

const prodSubCategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
    },
    subCategoryName: {
      type: String,
      required: [true, "Sub Category Name is required"],
      trim: true,
      index: true,
    },
    subCategoryDescription: {
      type: String,
    },
    subCategoryImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ProductSubCategory = mongoose.model("ProductSubCategory", prodSubCategorySchema);
