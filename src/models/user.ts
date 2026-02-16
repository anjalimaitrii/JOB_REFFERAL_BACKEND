import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    /* ================= BASIC ================= */
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['student', 'employee'],
      required: true,
    },

    profilePhoto: {
      type: String,
      default: '',
    },

    linkedin: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    /* ================= EDUCATION (COMMON) ================= */
    education: {
      type: [
        {
          level: String,
          institute: String,
          board: String,
          subject: String,
          grade: String,
          year: String,
        },
      ],
      default: [],
    },

    /* ================= SKILLS (COMMON) ================= */
    skills: {
      type: [String],
      default: [],
    },

    /* ================= PROJECTS (STUDENT ONLY) ================= */
    projects: {
      type: [
        {
          name: String,
          description: String,
          link: String,
        },
      ],
      default: [],
    },

    /* ================= EXPERIENCE (EMPLOYEE ONLY) ================= */
    experience: {
      type: [
        {
          company: String,
          role: String,
          location: String,
          duration: String,
        },
      ],
      default: [],
    },

    /* ================= JOB INFO (EMPLOYEE) ================= */
    company: {
      type: String,
      ref: "Company",
      default: '',
    },
    experienceLevel: {
      type: String,
      default: '',
    },
    designation: {
      type: String, // String to support "" in existing data
      default: '',
    },

    department: {
      type: String,
      default: '',
    },

    employmentType: {
      type: String,
      default: '',
    },

    companyEmail: {
      type: String,
      default: '',
    },

    isCompanyVerified: {
      type: Boolean,
      default: false,
    },

    /* ================= INTERESTS (EMPLOYEE) ================= */
    interests: {
      type: [String],
      default: [],
    },

    /* ================= STATUS ================= */
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for populating company details when 'company' is a valid ObjectId string
userSchema.virtual("companyDetails", {
  ref: "Company",
  localField: "company",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model('User', userSchema)
