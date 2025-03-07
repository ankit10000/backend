const User = require("../models/User");

const assignEmployeeToApp = async (req, res) => {
    try {
        const { employeeEmail, appName } = req.body;

        const employee = await User.findOne({ email: employeeEmail, role: "employee" });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (!Array.isArray(employee.assignedApps)) {
            employee.assignedApps = [];
        }

        if (!employee.assignedApps.includes(appName)) {
            employee.assignedApps.push(appName);
            await employee.save();
            return res.json({ message: `Employee assigned to ${appName} successfully` });
        } else {
            return res.status(400).json({ message: "Employee is already assigned to this app" });
        }

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const checkAssignedApps = async (req, res) => {
    try {
        const { employeeEmail } = req.params; 

        const employee = await User.findOne({ email: employeeEmail, role: "employee" });
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        res.json({ assignedApps: employee.assignedApps });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

module.exports = { assignEmployeeToApp, checkAssignedApps };


