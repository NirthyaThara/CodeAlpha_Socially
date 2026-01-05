const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate("sender", "username profilePicture")
            .populate("post", "content media") // Populate post preview if needed
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.markRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );
        res.json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
