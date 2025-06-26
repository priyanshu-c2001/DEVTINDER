const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://user2004:deNQsmMXDHN5xBNw@cluster0.35iscyr.mongodb.net/devTinder");
}

module.exports={
    connectDB,
}