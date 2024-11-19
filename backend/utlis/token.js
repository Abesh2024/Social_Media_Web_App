
import jwt from 'jsonwebtoken'

const tokenGenerate = (_id, res) => {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});
	
	res.cookie("jwt", token, {
		httpOnly : true,
		maxAge: 15 * 24 * 60 * 60 * 1000,  //ms
        // sameSite: 'none',
        secure: process.env.NODE_ENV === "production",
        path: '/',
	});

	return token;
};

export default tokenGenerate;
