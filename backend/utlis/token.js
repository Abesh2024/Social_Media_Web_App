
import jwt from 'jsonwebtoken'

const tokenGenerate = (_id, res) => {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});
	
	res.cookie("jwt", token, {
		httpOnly: true, // more secure
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "none", // CSRF
		secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production	});
	});

	return token;
};

export default tokenGenerate;
