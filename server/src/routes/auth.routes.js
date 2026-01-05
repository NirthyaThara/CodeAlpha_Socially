const express = require("express");
const router = express.Router();

const { register, login, getUsers, getProfile, updateDP, updateProfile, followUser, unfollowUser, searchUsers } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);
router.get("/search", searchUsers);
router.put("/update-dp", protect, upload.single("media"), updateDP);
router.put("/update-profile", protect, updateProfile);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.get("/:id", getProfile);

module.exports = router;
