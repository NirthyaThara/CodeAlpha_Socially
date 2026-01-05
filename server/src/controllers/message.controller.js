const Message = require("../models/Message");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, sharedPostId } = req.body;
        const senderId = req.user.id;
        console.log(`DEBUG: sendMessage Request - Sender: ${senderId}, Receiver: ${receiverId}, SharedPost: ${sharedPostId}`);

        // Check mutual followers
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMutual = sender.following.some(id => id.toString() === receiverId) &&
            receiver.following.some(id => id.toString() === senderId.toString());

        if (!isMutual) {
            return res.status(403).json({ message: "They didn't follow back! You can only message mutual followers." });
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content,
            sharedPost: sharedPostId
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).populate({
            path: 'sharedPost',
            populate: { path: 'user', select: 'username profilePicture' }
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getChatList = async (req, res) => {
    try {
        // Get users who follow me AND I follow back (Mutuals)
        const user = await User.findById(req.user.id);
        const mutuals = await User.find({
            $and: [
                { _id: { $in: user.following } },
                { following: req.user.id }
            ]
        }).select("username profilePicture");

        res.json(mutuals);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
