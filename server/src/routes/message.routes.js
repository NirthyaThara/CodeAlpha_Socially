const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { sendMessage, getMessages, getChatList } = require("../controllers/message.controller");

router.post("/", protect, sendMessage);
router.get("/users", protect, getChatList);
router.get("/:otherUserId", protect, getMessages);

module.exports = router;
