const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/admin");

const createAdminScript = async () => {
    try {
        console.log("[Init] Starting Admin Account Initialization Script...");

        const email = (process.env.ADMIN_EMAIL || process.env.DEFAULT_ADMIN_EMAIL || "admin@jmcreations.com").toLowerCase().trim();
        const password = process.env.ADMIN_INITIAL_PASSWORD || process.env.DEFAULT_ADMIN_PASSWORD || "Admin@12345";

        if (!email || !password) {
            console.error("[Error] ADMIN_EMAIL or ADMIN_INITIAL_PASSWORD missing in environment.");
            process.exit(1);
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            console.error("[Error] Invalid email format provided for ADMIN_EMAIL.");
            process.exit(1);
        }

        if (password.length < 8) {
            console.error("[Error] ADMIN_INITIAL_PASSWORD must be at least 8 characters long.");
            process.exit(1);
        }

        await connectDB();

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log(`[Info] Admin account '${email}' already exists in MongoDB. Skipping creation.`);
            await mongoose.disconnect();
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            name: "JM Super Admin",
            email: email,
            passwordHash: passwordHash,
            role: "superadmin",
            isActive: true
        });

        console.log(`[Success] Safe Admin account '${newAdmin.email}' created successfully (Role: ${newAdmin.role}).`);
    } catch (error) {
        console.error("[Error] Admin creation failed:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

createAdminScript();
