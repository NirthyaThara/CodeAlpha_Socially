const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        let media = "";
        let mediaType = "none";

        if (req.file) {
            media = `/uploads/${req.file.filename}`;
            mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
        }

        const post = await Post.create({
            user: req.user.id,
            content,
            media,
            mediaType
        });

        const populatedPost = await post.populate("user", "username profilePicture");

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getSavedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ saves: req.user.id })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.likes.indexOf(req.user.id);
        if (index === -1) {
            post.likes.push(req.user.id);

            // Create Notification
            if (post.user.toString() !== req.user.id) {
                await Notification.create({
                    recipient: post.user,
                    sender: req.user.id,
                    type: "like",
                    post: post._id
                });
            }
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.sharePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.shares += 1;
        await post.save();
        res.json({ message: "Post shared", shares: post.shares });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.savePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.saves.indexOf(req.user.id);
        if (index === -1) {
            post.saves.push(req.user.id);
        } else {
            post.saves.splice(index, 1);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        post.content = content || post.content;
        await post.save();

        await post.populate("user", "username profilePicture");
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await post.deleteOne();
        res.json({ message: "Post removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
