const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const messageRoutes = require("./routes/message.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", require("./routes/notification.routes"));

app.get("/", (req, res) => {
    res.send("API running");
});

module.exports = app;
