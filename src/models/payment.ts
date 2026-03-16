import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["paid", "released"],
            default: "paid"
        }

    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);