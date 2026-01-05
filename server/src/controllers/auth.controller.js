const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Notification = require("../models/Notification.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // 2. Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("AUTH ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }

};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // 2. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 4. Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("AUTH ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await Post.find({ user: req.params.id }).populate("user", "username profilePicture").sort({ createdAt: -1 });

        res.json({ user, posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateDP = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture: `/uploads/${req.file.filename}` },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile picture updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, bio } = req.body;
        const updates = {};
        if (username) updates.username = username;
        if (bio) updates.bio = bio;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true }
        ).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        const isAlreadyFollowing = userToFollow.followers.some(id => id.toString() === req.user.id);

        if (!isAlreadyFollowing) {
            userToFollow.followers.push(req.user.id);
            currentUser.following.push(req.params.id);
            await userToFollow.save();
            await currentUser.save();

            // Create Notification
            await Notification.create({
                recipient: userToFollow._id,
                sender: req.user.id,
                type: "follow"
            });

            res.json({ message: "Followed successfully" });
        } else {
            res.status(400).json({ message: "Already following" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.id);
        currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);

        await userToUnfollow.save();
        await currentUser.save();
        res.json({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        const users = await User.find({
            username: { $regex: query, $options: "i" }
        }).select("-password").limit(10);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
