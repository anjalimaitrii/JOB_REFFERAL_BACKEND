import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String, // image URL
    },
    industry: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    otherLocations: {
      type: [String],
    },
    companySize: {
      type: String,
    },
    website: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    jobs: [JobSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
