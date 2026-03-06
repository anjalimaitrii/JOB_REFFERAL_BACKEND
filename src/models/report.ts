import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            required: true
        },

        reason: {
            type: String,
            default: "reported"
        }

    },
    { timestamps: true }
);

reportSchema.index({ reporter: 1, post: 1 }, { unique: true });

export default mongoose.model("Report", reportSchema);