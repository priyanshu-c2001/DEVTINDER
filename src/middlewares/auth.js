const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;

        if (!token) {
            throw new Error("Invalid Token!!");
        }

        const decodedToken = jwt.verify(token, "DEV@Tinder$790");
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