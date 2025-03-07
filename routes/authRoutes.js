const express = require("express");
const { registerAdmin, registerEmployee, login, getProfile } = require("../controllers/authController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/register-admin",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    registerAdmin
);

router.post(
    "/register-employee",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    registerEmployee
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    login
);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;
