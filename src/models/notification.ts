import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  receiver: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: "message" | "request_accepted" | "request_rejected";
  request?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["message", "request_accepted", "request_rejected", "referral_completed", "request_received", "payment_success_employee",
        "payment_success_student", "refund_received", "request_expired"],
      required: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
