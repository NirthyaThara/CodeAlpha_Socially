const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getNotifications, markRead } = require("../controllers/notification.controller");

router.get("/", protect, getNotifications);
router.put("/read", protect, markRead);

module.exports = router;
