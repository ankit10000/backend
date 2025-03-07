const express = require("express");
const { saveToNotepad, getFeedback } = require("../controllers/notepadController");

const router = express.Router();

router.post("/save-to-notepad", saveToNotepad);
router.get("/get_feedback", getFeedback);

module.exports = router;
