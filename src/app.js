const express = require('express');
const {connectDB} = require("./config/database");
const app = express();
const {User}=require("./models/user");

app.post("/signup", async(req, res)=>{
  const user=new User({
    firstName: "Priyanshu",
    lastName: "Chaurasia",
    emailId: "pc.0o05x@gmail.com",
    password: "priyanshu@123"
  });

  try{
    await user.save();
    res.send("User Added successfully!");
  } catch(err){
    res.status(400).send("Error saving the user:" + err.message);
  }
});

connectDB().then(() => {
  console.log("Database connection established...");
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });

}).catch((error) => {
  console.error("Databse cannot be connected!!");
  console.error(error);
});

