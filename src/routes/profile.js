const express = require('express');
const { auth } = require("../middlewares/auth");
const {validateEditProfileData} = require('../utils/validation');
const {User} = require("../models/user");
const bcrypt = require('bcrypt');

const router=express.Router();

router.get('/profile/view', auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }

});

router.patch('/profile/edit', auth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request!");
    }

    const loggedInUser=req.user;
    Object.keys(req.body).forEach((key)=> (loggedInUser[key]=req.body[key]));

    await loggedInUser.save();

    res.json({message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser});
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.patch('/profile/password', auth, async (req, res)=>{
  try{
    const {oldPassword, newPassword}=req.body;
    const user=await User.findOne({emailId: req.user.emailId});
    const isOldPasswordValid= await user.validatePassword(oldPassword);
    if(!isOldPasswordValid){
      throw new Error("Old Password is Incorrect..!!");
    }
    const hashedPassword=await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate({_id: req.user._id}, {password: hashedPassword}, {
      runValidators: true
    });

    res.send("Password Changed Successfully..!!!");
  }
  catch(err){
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports=router;