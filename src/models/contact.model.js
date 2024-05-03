import mongoose, {Schema} from "mongoose";

const contactSchema = new Schema({
    conName: {
        type: String,
        required: true
    },
    conEmail: {
        type: String,
        required: true,
        lowercase: true,
    },
    conPhoneNumber: {
        type: String,
        required: true
    },
    conCompanyName: {
        type: String,
        required: true
    },
    conSubject: {
        type: String,
        required: true
    },
    conMessage: {
        type: String,
        default: ''
    }
},
    { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);