const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            console.log("AUTH ERROR: No token provided");
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        console.log("DEBUG: Verifying token with secret exists:", !!process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR:", error.name, error.message);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = { protect };
