import PostModel from "../model/postModel.js";
import UserModel from "../model/usermodel.js";
import { v2 as cloudinary } from "cloudinary";


const createPost = async (req, res) => {
    const { postedBy, text } = req.body;
	let { img } = req.body;
	console.log(req.user);
    try {

        if (!postedBy || !text) {
            return res.status(400).json({ error: "Postedby and text fields are required" });
        }

        const user = await UserModel.findById(postedBy)

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to create post" });
        }

        const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

        const newPost = new PostModel({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);

    } catch (err) {
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}

const getPost = async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await PostModel.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await PostModel.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await PostModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const userName = req.user.userName;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await PostModel.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, userName };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	// console.log("HIIII");
	// console.log(req.user, "12345678");
	try {
		const userId = req.user._id;
		// console.log(userId)
		const user = await UserModel.findById(userId);
		// console.log(user);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await PostModel.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ message: err.message, message: "error found here" });
	}
};

const getUserPosts = async (req, res) => {
	const { userName } = req.params;
	console.log("Received userName:", userName);

	try {
		const user = await UserModel.findOne({ userName });
		console.log("User query result:", user);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await PostModel.find({ postedBy: user._id }).sort({ createdAt: -1 });
		console.log("Posts query result:", posts);

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error fetching user posts:", error);
		res.status(500).json({ error: error.message });
	}
};


const postControllers = {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts}

export default postControllers;