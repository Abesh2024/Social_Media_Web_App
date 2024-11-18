import express from "express";
import postControllers from "../controller/postcontroller.js";
import protectRoute from "../middleware/protectedRoute.js";

const postRouter = express.Router();

// Define specific routes first
postRouter.post("/create-post", protectRoute, postControllers.createPost);
postRouter.put("/like/:id", protectRoute, postControllers.likeUnlikePost);
postRouter.put("/reply/:id", protectRoute, postControllers.replyToPost);
postRouter.get("/feed", protectRoute, postControllers.getFeedPosts);
postRouter.get("/user/:userName", postControllers.getUserPosts);

// Define dynamic routes after specific ones
postRouter.get("/:id", postControllers.getPost);
postRouter.delete("/:id", protectRoute, postControllers.deletePost);

export default postRouter;