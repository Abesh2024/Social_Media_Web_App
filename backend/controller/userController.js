import UserModel from "../model/usermodel.js";
import bcrypt from "bcryptjs";
import tokenGenerate from "../utlis/token.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
// import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
    /* query is either gonna be userName or userId */
    const { query } = req.params;

    try {
        let user;

        /* query s userId */
        if(mongoose.Types.ObjectId.isValid(query)) {
            user = await UserModel.findOne({_id: query}).select("-password")
        } else {
         user = await UserModel.findOne({userName: query}).select("-password")
        }

        if(!user) return res.json({error: "user not found with this username"})

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getUserProfile: ", err.message);
    }
};

const userSignup = async (req, res) => {
    try {
        const { name, userName, email, password } = req.body;

        const userExist = await UserModel.findOne({ email });

        if (userExist) {
            return res.json({
                success: false,
                message: "User exists in the database already",
            });
        }

        const salt = await bcrypt.genSalt(7);
        const hashedPassword = await bcrypt.hash(password, salt); 

        const user = new UserModel({
            name,
            email,
            userName,
            password: hashedPassword, 
        });
        await user.save();

        if (user) {
           tokenGenerate(user._id, res);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userName: user.userName,
                bio: user.bio,
                profilePic: user.profilePic,
                
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: `Something is wrong: ${err.message}`,
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await UserModel.findOne({ userName });   //name, userName, email, password

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password || ""
        );
        // console.log(user, isPasswordCorrect, "880054");
        if (!user || !isPasswordCorrect)
            return res
                .status(400)
                .json({ message: "Invalid username or password" });

        tokenGenerate(user._id, res);
        
		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}


        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            userName: user.userName,
            bio: user.bio,
            profilePic: user.profilePic,
        });
    } catch (error) {
        res.status(500).json({ error: "somrthing is wrong" });
        // console.log("Error in loginUser: ", error.message);
    }
};



const userLogout = (req, res) => {
	try {
		res.clearCookie("jwt", {
            path: "/",
            expires: new Date(0),
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production"
        });
		res.status(200).json({ message: "User logged out successfully" });	
     } catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};


const followUnfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await UserModel.findById(id);
        const currentUser = await UserModel.findById(req.user._id);

        // if (id === req.user._id.toString())
        //     return res
        //         .status(400)
        //         .json({ error: "You cannot follow/unfollow yourself" });

        if (!userToModify || !currentUser)
            return res.status(400).json({ error: "User not found" }); 

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow user
            await UserModel.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },  
            });
            await UserModel.findByIdAndUpdate(req.user._id, {
                $pull: { following: id }, 
            });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow user
            await UserModel.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            });
            await UserModel.findByIdAndUpdate(req.user._id, {
                $push: { following: id },
            });
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: `Something is wrong: ${err.message}`,
        });
    }
};

const updateUserProfile = async (req, res) => {
    const { name, email, userName, bio } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    let { profilePic } = req.body;

    try {
        let user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user._id.toString() !== id) {
            return res
                .status(403)
                .json({ message: "You cannot update another user's profile" });
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(
                    user.profilePic.split("/").pop().split(".")[0]
                );
            }

            const uploadedResponse = await cloudinary.uploader.upload(
                profilePic
            );
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.userName = userName || user.userName;
        user.bio = bio || user.bio;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;

        await user.save();
        res.json({message: "user updated successfully", user});

    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ message: "Email or username already exists" });
        }
        return res.status(500).json({
            success: false,
            error: `Something is wrong: ${err.message}`,
        });
    }
};

const suggestedUser = async (req, res) => {
    try {
        	// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await UserModel.findById(userId).select("following");

		const users = await UserModel.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
    } catch (error) {
		res.status(500).json({ error: error.message });
    }
}

const logics = {
    userSignup,
    userLogin,
    userLogout,
    followUnfollow,
    updateUserProfile,
    getUserProfile,
    suggestedUser
};

export default logics;
