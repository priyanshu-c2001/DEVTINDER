const express=require('express');
const { auth } = require("../middlewares/auth");

const router=express.Router();

router.post('/sendConnectionRequest', auth, (req, res) => {
  console.log("Sending Request....");
  res.send("request sended!!");
});

module.exports=router;