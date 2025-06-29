const express = require('express');
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const body = req.body;
  const user = new User(body);

  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

// Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user.length) res.send("User not Found!!");
    else res.send(user);
  }
  // try{
  //   const user=await User.find({emailId: userEmail});
  //   if(!user.length) res.send("User not Found!!");
  //   else res.send(user);
  // }
  catch (err) {
    res.status(400).send("Something Went Wrong!!");
    console.log(err);
  }
});

// Feed API - GET /feed - get all the users from the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) res.send("No User Exist!!");
    else res.send(users);
  }
  catch (err) {
    res.status(400).send("Something Went Wrong!!");
  }
});

// Delete a user from the database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (user == null) res.send("User Not Found!!");
    else res.send("User Deleted Successfully!!");
  }
  catch (err) {
    res.status(400).send("Something Went Wrong!!");
  }
});

// Update data of the user
app.patch('/user/:userId', async (req, res) => {
  const userId=req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if(data?.skills.length>10){
      throw new Error("Limit Exceed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log(user);

    res.send("User updated Successfully!!");
  }
  catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
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

