import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import  Collage  from "../models/collage";

dotenv.config();

const importInstitutions = async () => {
    try {
        // Database connection
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/job_referral";
        await mongoose.connect(mongoUri);
        console.log("✅ Database connected successfully");

        // Read JSON file
        const filePath = path.join(__dirname, "../../institutions.json");
        const jsonData = fs.readFileSync(filePath, "utf-8");
        const institutions = JSON.parse(jsonData);

        console.log(`📊 Total institutions to import: ${institutions.length}`);

        // Clear existing data (optional - comment out if you want to keep existing data)
        await Collage.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Insert data in batches for better performance
        const batchSize = 1000;
        let imported = 0;

        for (let i = 0; i < institutions.length; i += batchSize) {
            const batch = institutions.slice(i, i + batchSize);
            await Collage.insertMany(batch, { ordered: false });
            imported += batch.length;
            console.log(`✅ Imported ${imported}/${institutions.length} institutions`);
        }

        console.log("🎉 All institutions imported successfully!");
        
    } catch (error: any) {
        console.error("❌ Error importing institutions:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
};

// Run the import
importInstitutions();
