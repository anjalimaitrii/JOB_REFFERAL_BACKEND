import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user";

dotenv.config();

const createAdmin = async () => {
    try {
        // Database connection
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/job_referral";
        await mongoose.connect(mongoUri);
        console.log("✅ Database connected successfully");

        const adminEmail = "admin@gmail.com";
        const adminPassword = "123";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("⚠️  Admin already exists. Updating password and wallet...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.wallet = 0;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log("✅ Admin updated successfully!");
        } else {
            console.log("📝 Creating new admin...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await User.create({
                name: "Admin System",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                contact: "0000000000",
                wallet: 0
            });
            console.log("🎉 Admin created successfully!");
        }

    } catch (error: any) {
        console.error("❌ Error creating admin:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
};

// Run the script
createAdmin();
