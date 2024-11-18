
import jwt from 'jsonwebtoken'

const tokenGenerate = (_id, res) => {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,  //ms
        sameSite: 'none',
        secure: true,
        path: '/',
	});

	return token;
};

export default tokenGenerate;
