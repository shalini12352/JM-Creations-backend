const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

const JWT_SECRET = process.env.JWT_SECRET || "jmcreations_secure_jwt_secret_key_2026";

// Generate JWT Token
const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, JWT_SECRET, {
        expiresIn: "7d"
    });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled. Please contact support."
            });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(admin._id, admin.email, admin.role);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                isActive: req.user.isActive,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        console.error("getMe error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching user profile"
        });
    }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private / Public
const logout = async (req, res) => {
    res.json({
        success: true,
        message: "Logged out successfully"
    });
};

// Seed default admin if no admin accounts exist
const seedInitialAdmin = async () => {
    try {
        const defaultEmail = (
            process.env.DEFAULT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@jmcreations.com"
        ).toLowerCase().trim();

        const defaultPassword =
            process.env.DEFAULT_ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || "Admin@12345";

        let admin = await Admin.findOne({ email: defaultEmail });

        if (!admin) {
            const passwordHash = await bcrypt.hash(defaultPassword, 10);

            admin = await Admin.create({
                name: "JM Admin",
                email: defaultEmail,
                passwordHash,
                role: "superadmin",
                isActive: true
            });

            console.log(`[Seed] Admin created: ${defaultEmail}`);
        } else {
            const isMatch = await admin.comparePassword(defaultPassword);
            if (!isMatch) {
                admin.passwordHash = await bcrypt.hash(defaultPassword, 10);
                admin.isActive = true;
                admin.role = "superadmin";

                await admin.save();

                console.log(`[Seed] Admin credentials updated from env: ${defaultEmail}`);
            } else {
                console.log(`[Seed] Admin verified: ${defaultEmail}`);
            }
        }
    } catch (error) {
        console.error("[Seed] Error:", error.message);
    }
};

module.exports = {
    login,
    getMe,
    logout,
    seedInitialAdmin
};
