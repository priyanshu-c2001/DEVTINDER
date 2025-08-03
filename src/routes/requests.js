const express=require('express');
const { auth } = require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const {User}=require('../models/user');
const router=express.Router();

router.post('/request/send/:status/:touserId', auth, async(req, res) => {
  try{
    const fromUserId=req.user._id;
    const toUserId=req.params.touserId;
    const status=req.params.status;
 
    const allowedStatus=['ignore', 'interested']
    const isAllowedStatus=allowedStatus.includes(status);
    
    if(!isAllowedStatus){
      throw new Error(`Invalid status type: ${status}`);
    }
    
    const isTouserExist=await User.findById(toUserId );

    if(!isTouserExist){
      throw new Error("toUser is not Exist..!!!");
    }

    const isConnectionAlreadySended=await ConnectionRequest.findOne({
      $or:[
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId},
      ]
    });

    if(isConnectionAlreadySended){
      throw new Error("You have already requested to this user..!!!");
    }

    const connectionRequest= new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data=await connectionRequest.save();

    res.json({
      message: "Connection Request Sent Successfully!!",
      data,
    });
  }
  catch(err){
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

router.post('/request/review/:status/:requestId', auth, async(req, res)=>{
  try{
    const loggedInUser=req.user;
    const {status, requestId}=req.params;
    const allowedStatus=['accepted', 'rejected']
    const isAllowedStatus=allowedStatus.includes(status);

    if(!isAllowedStatus) {
      throw new Error(`Invalid status type: ${status}`);
    }

    const connectionRequest=await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if(!connectionRequest){
      throw new Error("Connection Request not Found!!");
    }

    connectionRequest.status=status
    const data= await connectionRequest.save();

    res.json({
      message: "Connection request " + status, data
    });

  }
  catch(err){
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

module.exports=router;