const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const JWT_SECRET = process.env.JWT_SECRET || "jmcreations_secure_jwt_secret_key_2026";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-auth-token"]) {
        token = req.headers["x-auth-token"];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no authentication token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const admin = await Admin.findById(decoded.id).select("-passwordHash");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user no longer exists"
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled. Please contact system administrator."
            });
        }

        req.user = admin;
        next();
    } catch (error) {
        console.error("Auth Middleware error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not authorized, token verification failed"
        });
    }
};

module.exports = { protect };
