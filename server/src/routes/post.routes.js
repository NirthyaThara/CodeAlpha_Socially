const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
    createPost,
    getPosts,
    likePost,
    sharePost,
    savePost,
    getSavedPosts,
    updatePost,
    deletePost
} = require("../controllers/post.controller");
const { addComment, getComments } = require("../controllers/comment.controller");

router.post("/", protect, upload.single("media"), createPost);
router.get("/", getPosts);
router.get("/saved", protect, getSavedPosts);
router.post("/:id/like", protect, likePost);
router.post("/:id/share", protect, sharePost);
router.post("/:id/save", protect, savePost);
router.post("/:postId/comments", protect, addComment);
router.get("/:postId/comments", getComments);

router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
module.exports = router;
