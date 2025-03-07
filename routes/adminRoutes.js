const express = require("express");
const { assignEmployeeToApp, checkAssignedApps  } = require("../controllers/adminController");
const  authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = express.Router();

router.post(
    "/assign-app",
    authMiddleware,
    [
        body("employeeEmail").isEmail().withMessage("Valid Employee Email is required"),
        body("appName").notEmpty().withMessage("App Name is required"),
    ],
    assignEmployeeToApp
);
router.get("/check-assigned-apps/:employeeEmail", authMiddleware, checkAssignedApps);

module.exports = router;
