import mongoose, {Schema} from "mongoose";

const brandSchema = new Schema({
    brandName: {
        type: String,
        required: true
    },
    brandLogo: {
        type: String,
        required: true,
    },
    brandDescription: {
        type: String,
        required: true
    },
    brandType: {
        type: String,
        required: true,
        enum: ["Our Brands", "Associated Brands"]
    }
},
    { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);