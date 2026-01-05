require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });
