import mongoose from 'mongoose';


const followSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true })


followSchema.index({ student: 1, employee: 1 }, { unique: true })
export default mongoose.model("Follow", followSchema)