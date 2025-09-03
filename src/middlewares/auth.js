const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;

        if (!token) {
            res.status(401).json({message: "Please Login!"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;
        const user = await User.findById({ _id: _id });

        if (!user) {
            throw new Error("No User Exist!!");
        }

        req.user = user;

        next();
    }catch(err){
        res.status(400).send("ERROR" + err.message);
    }
}

module.exports = {
    auth,
}