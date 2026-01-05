const Post = require("../models/Post");

exports.addComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        user: req.user.id,
                        content
                    }
                }
            },
            { new: true }
        ).populate("comments.user", "username profilePicture");

        // Return the last added comment (which is now at the end)
        // Or strictly, we can just return the updated comments list or the specific new comment.
        // For frontend compatibility which likely expects the new comment to append:
        const newComment = post.comments[post.comments.length - 1];
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("comments.user", "username profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Return comments reversed (newest first) to match previous behavior if needed, 
        // or just return as is. 'createdAt: -1' was used before.
        const comments = post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
