const mongoose = require("mongoose");
const Career = require("../models/career");

const VALID_EMPLOYMENT_TYPES = ["full-time", "part-time", "internship", "contract", "freelance"];
const VALID_STATUSES = ["open", "closed"];
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Helper to validate and clean array fields
const processStringArray = (arr, fieldName) => {
    if (arr === undefined || arr === null) return { valid: true, data: [] };
    if (!Array.isArray(arr)) return { valid: false, message: `${fieldName} must be an array of strings` };
    const cleaned = arr
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0);
    return { valid: true, data: cleaned };
};

// ==========================================
// CREATE NEW CAREER OPPORTUNITY
// POST /api/careers
// ==========================================
const createCareer = async (req, res) => {
    try {
        const {
            title,
            department,
            location,
            employmentType,
            description,
            responsibilities,
            requirements,
            skills,
            experience,
            salary,
            status,
            featured,
            applicationEmail,
            displayOrder
        } = req.body || {};

        // Trim string inputs
        const trimmedTitle = typeof title === "string" ? title.trim() : "";
        const trimmedDescription = typeof description === "string" ? description.trim() : "";
        const trimmedDepartment = typeof department === "string" ? department.trim() : "";
        const trimmedLocation = typeof location === "string" ? location.trim() : "";
        const trimmedEmploymentType = typeof employmentType === "string" ? employmentType.trim() : "full-time";
        const trimmedExperience = typeof experience === "string" ? experience.trim() : "";
        const trimmedSalary = typeof salary === "string" ? salary.trim() : "";
        const trimmedStatus = typeof status === "string" ? status.trim() : "open";
        const trimmedEmail = typeof applicationEmail === "string" ? applicationEmail.trim() : "";

        // Validate required fields
        if (!trimmedTitle || !trimmedDescription) {
            return res.status(400).json({
                success: false,
                message: "Required fields (title, description) must be provided"
            });
        }

        // Validate employmentType enum
        if (!VALID_EMPLOYMENT_TYPES.includes(trimmedEmploymentType)) {
            return res.status(400).json({
                success: false,
                message: `employmentType must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
            });
        }

        // Validate status enum
        if (!VALID_STATUSES.includes(trimmedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'open' or 'closed'"
            });
        }

        // Validate arrays
        const respCheck = processStringArray(responsibilities, "responsibilities");
        if (!respCheck.valid) {
            return res.status(400).json({ success: false, message: respCheck.message });
        }

        const reqCheck = processStringArray(requirements, "requirements");
        if (!reqCheck.valid) {
            return res.status(400).json({ success: false, message: reqCheck.message });
        }

        const skillsCheck = processStringArray(skills, "skills");
        if (!skillsCheck.valid) {
            return res.status(400).json({ success: false, message: skillsCheck.message });
        }

        // Validate applicationEmail format if provided
        if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application email format"
            });
        }

        // Parse displayOrder
        const parsedDisplayOrder = typeof displayOrder === "number" ? displayOrder : (Number(displayOrder) || 0);

        // Create career in DB
        const career = await Career.create({
            title: trimmedTitle,
            department: trimmedDepartment,
            location: trimmedLocation,
            employmentType: trimmedEmploymentType,
            description: trimmedDescription,
            responsibilities: respCheck.data,
            requirements: reqCheck.data,
            skills: skillsCheck.data,
            experience: trimmedExperience,
            salary: trimmedSalary,
            status: trimmedStatus,
            featured: Boolean(featured),
            applicationEmail: trimmedEmail,
            displayOrder: parsedDisplayOrder
        });

        return res.status(201).json({
            success: true,
            message: "Career opportunity created successfully",
            data: career
        });
    } catch (error) {
        console.error("Error creating career opportunity:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create career opportunity"
        });
    }
};

// ==========================================
// GET ALL CAREER OPPORTUNITIES
// GET /api/careers
// ==========================================
const getCareers = async (req, res) => {
    try {
        const { status, department, employmentType, featured } = req.query;
        const filter = {};

        if (status !== undefined) {
            const trimmedStatus = typeof status === "string" ? status.trim() : "";
            if (!VALID_STATUSES.includes(trimmedStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status filter. Must be 'open' or 'closed'"
                });
            }
            filter.status = trimmedStatus;
        }

        if (department !== undefined) {
            const trimmedDepartment = typeof department === "string" ? department.trim() : "";
            filter.department = trimmedDepartment;
        }

        if (employmentType !== undefined) {
            const trimmedType = typeof employmentType === "string" ? employmentType.trim() : "";
            if (!VALID_EMPLOYMENT_TYPES.includes(trimmedType)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid employmentType filter. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
                });
            }
            filter.employmentType = trimmedType;
        }

        if (featured !== undefined) {
            if (featured === "true" || featured === true) {
                filter.featured = true;
            } else if (featured === "false" || featured === false) {
                filter.featured = false;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid featured filter. Must be boolean 'true' or 'false'"
                });
            }
        }

        const careers = await Career.find(filter).sort({ displayOrder: 1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: careers.length,
            data: careers
        });
    } catch (error) {
        console.error("Error fetching career opportunities:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch career opportunities"
        });
    }
};

// ==========================================
// GET SINGLE CAREER BY ID
// GET /api/careers/:id
// ==========================================
const getCareerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career ID format"
            });
        }

        const career = await Career.findById(id);

        if (!career) {
            return res.status(404).json({
                success: false,
                message: "Career opportunity not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: career
        });
    } catch (error) {
        console.error("Error fetching career by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch career opportunity"
        });
    }
};

// ==========================================
// UPDATE CAREER OPPORTUNITY
// PUT /api/careers/:id
// ==========================================
const updateCareer = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career ID format"
            });
        }

        const existingCareer = await Career.findById(id);
        if (!existingCareer) {
            return res.status(404).json({
                success: false,
                message: "Career opportunity not found"
            });
        }

        const updateData = { ...req.body };

        // Validate title if updated
        if (updateData.title !== undefined) {
            if (typeof updateData.title === "string") {
                updateData.title = updateData.title.trim();
            }
            if (!updateData.title) {
                return res.status(400).json({
                    success: false,
                    message: "title cannot be empty"
                });
            }
        }

        // Validate description if updated
        if (updateData.description !== undefined) {
            if (typeof updateData.description === "string") {
                updateData.description = updateData.description.trim();
            }
            if (!updateData.description) {
                return res.status(400).json({
                    success: false,
                    message: "description cannot be empty"
                });
            }
        }

        // Validate employmentType if updated
        if (updateData.employmentType !== undefined) {
            if (typeof updateData.employmentType === "string") {
                updateData.employmentType = updateData.employmentType.trim();
            }
            if (!VALID_EMPLOYMENT_TYPES.includes(updateData.employmentType)) {
                return res.status(400).json({
                    success: false,
                    message: `employmentType must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
                });
            }
        }

        // Validate status if updated
        if (updateData.status !== undefined) {
            if (typeof updateData.status === "string") {
                updateData.status = updateData.status.trim();
            }
            if (!VALID_STATUSES.includes(updateData.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status must be either 'open' or 'closed'"
                });
            }
        }

        // Trim string fields
        if (typeof updateData.department === "string") updateData.department = updateData.department.trim();
        if (typeof updateData.location === "string") updateData.location = updateData.location.trim();
        if (typeof updateData.experience === "string") updateData.experience = updateData.experience.trim();
        if (typeof updateData.salary === "string") updateData.salary = updateData.salary.trim();

        // Validate applicationEmail if updated
        if (updateData.applicationEmail !== undefined) {
            if (typeof updateData.applicationEmail === "string") {
                updateData.applicationEmail = updateData.applicationEmail.trim();
            }
            if (updateData.applicationEmail && !EMAIL_REGEX.test(updateData.applicationEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid application email format"
                });
            }
        }

        // Validate arrays if updated
        if (updateData.responsibilities !== undefined && updateData.responsibilities !== null) {
            const respCheck = processStringArray(updateData.responsibilities, "responsibilities");
            if (!respCheck.valid) return res.status(400).json({ success: false, message: respCheck.message });
            updateData.responsibilities = respCheck.data;
        }

        if (updateData.requirements !== undefined && updateData.requirements !== null) {
            const reqCheck = processStringArray(updateData.requirements, "requirements");
            if (!reqCheck.valid) return res.status(400).json({ success: false, message: reqCheck.message });
            updateData.requirements = reqCheck.data;
        }

        if (updateData.skills !== undefined && updateData.skills !== null) {
            const skillsCheck = processStringArray(updateData.skills, "skills");
            if (!skillsCheck.valid) return res.status(400).json({ success: false, message: skillsCheck.message });
            updateData.skills = skillsCheck.data;
        }

        // Update career in DB
        const career = await Career.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Career opportunity updated successfully",
            data: career
        });
    } catch (error) {
        console.error("Error updating career opportunity:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update career opportunity"
        });
    }
};

// ==========================================
// DELETE CAREER OPPORTUNITY
// DELETE /api/careers/:id
// ==========================================
const deleteCareer = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid career ID format"
            });
        }

        const career = await Career.findByIdAndDelete(id);

        if (!career) {
            return res.status(404).json({
                success: false,
                message: "Career opportunity not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Career opportunity deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting career opportunity:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete career opportunity"
        });
    }
};

module.exports = {
    createCareer,
    getCareers,
    getCareerById,
    updateCareer,
    deleteCareer
};
