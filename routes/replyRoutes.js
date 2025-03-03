const express = require("express");
const { sendReply, getAllReplies, getRepliesByEmail } = require("../controllers/replyController");

const router = express.Router();

router.post("/send-reply", sendReply);
router.get("/replies", getAllReplies);
router.get("/replies-by-email", getRepliesByEmail); // Fetch replies for a specific email

module.exports = router;
