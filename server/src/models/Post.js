const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        media: {
            type: String
        },
        mediaType: {
            type: String,
            enum: ["image", "video", "none"],
            default: "none"
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        shares: {
            type: Number,
            default: 0
        },
        saves: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
