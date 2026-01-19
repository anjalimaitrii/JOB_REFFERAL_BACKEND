import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
