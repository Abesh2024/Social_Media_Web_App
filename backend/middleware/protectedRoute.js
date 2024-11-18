import UserModel from "../model/usermodel.js";
import jwt, { decode } from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded, "decoded{}[]()");
        
        const user = await UserModel.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default protectRoute;
