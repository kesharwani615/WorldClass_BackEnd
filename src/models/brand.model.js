import mongoose, {Schema} from "mongoose";

const brandSchema = new Schema({
    brandType: {
        type: String,
        required: true,
        enum: ["Our Brands", "Associated Brands"]
    },
    brandName: {
        type: String,
        required: true
    },
    brandDescription: {
        type: String,
        required: true
    },
    brandLogo: {
        type: String,
        required: true,
    }    
},
    { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);