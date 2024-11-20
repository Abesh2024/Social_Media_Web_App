
import jwt from 'jsonwebtoken'

const tokenGenerate = (_id, res) => {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});
	
	res.cookie("jwt", token, {
		httpOnly: true, // more secure
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "strict", // CSRF
	});

	return token;
};

export default tokenGenerate;
