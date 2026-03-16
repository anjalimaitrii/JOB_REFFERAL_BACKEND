import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    role: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
