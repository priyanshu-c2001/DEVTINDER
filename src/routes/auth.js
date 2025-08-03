const express=require('express');
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');

const router=express.Router();

router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser=await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000)
    }).json({msg: "User Added successfully!", data: savedUser});
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Format of emailId is Incorrect!!");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials..!!!");

    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) throw new Error("Invalid Credentials..!!!");

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000)
    }).send(user);
  }
  catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.post('/logout', async(req, res)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  res.send("Logged out Successfully..!!!");
});
 
module.exports=router;