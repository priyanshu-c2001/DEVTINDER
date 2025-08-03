const express=require('express');
const {auth}=require('../middlewares/auth');
const ConnectionRequest=require('../models/connectionRequest');
const {User}=require("../models/user");

const USER_SAFE_DATA="firstName lastName age gender skills photoUrl";

const userRouter=express.Router();
 
userRouter.get('/user/request', auth, async(req, res)=>{
    try{
        const loggedInUser=req.user;
    
        const recievedConnectionRequest=await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested", 
        }).populate("fromUserId", USER_SAFE_DATA);

        // .populate("fromUserId", ["firstName", "lastName"]);

        if(!recievedConnectionRequest){
            throw new Error("No Request Recieved..!!!");
        }
        /* const detailsOfRequestedUser=await Promise.all(recievedConnectionRequest.map(async(user)=> {
            return await User.findOne({
                _id: user.fromUserId,
            });
        }));

        console.log(detailsOfRequestedUser); */

        res.json({
            message: "Recieved Request: ",
            recievedConnectionRequest,
        });
    }
    catch(err){
        res.status(400).send(`ERROR: ${err.message}`);
    }


});

userRouter.get('/user/connections', auth, async(req, res)=>{
    try{
        const loggedInUser=req.user;
    
        const connections=await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser, status: "accepted"},
                {toUserId: loggedInUser, status: "accepted"},
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        if(!connections){
            throw new Error("You have no Connections!!");
        }

        const data= connections.map((user)=>(user.fromUserId._id.toString()===loggedInUser._id.toString())?user.toUserId:user.fromUserId);
        
        res.json({
            message: "Your Connections: ",
            data
        });
    }
    catch(err){
        res.status(400).send(`ERROR: ${err.message}`);
    }
});

userRouter.get('/user/feed', auth, async(req, res)=>{
    try{
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10 ;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;

        const connections= await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser},
                {toUserId: loggedInUser}
            ]
        }).select("fromUserId toUserId");

        const blockedUsersFromFeed=new Set();
        blockedUsersFromFeed.add(loggedInUser._id); // to remove loggedIn user on first Signup because on initial account creation of user there is no connection of that user so it's own id in not inlcude in the set 
        connections.forEach(element => {
            blockedUsersFromFeed.add(element.fromUserId);
            blockedUsersFromFeed.add(element.toUserId);
        });

        const feedUsers=await User.find({
            _id: {$nin: Array.from(blockedUsersFromFeed)}
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({
            feedUsers
        });
    }
    catch(err){
        res.status(400).send(`ERROR: ${err.message}`);
    }
});

module.exports=userRouter;