import mongoose from "mongoose";

const collageSchema = new mongoose.Schema({
    aishe_code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Collage", collageSchema);