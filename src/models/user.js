const mongoose=require('mongoose');
const validator=require('validator');

const userSchema= mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true, 
        trim: true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error("Email format is Incorrect...!! " + email);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(passcode){
            if(!validator.isStrongPassword(passcode)){
                throw new Error("Entered passcode is weak...!!" + passcode);
            }
        },
    },
    age: {
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6g9BWr61gs6KYIq3zjFEy36Z8OuOIJQ75A&s",
        validate(url){
            if(!validator.isURL(url)){
                throw new Error("URL format is Incorrect...!! " + url);
            }
        },
    },
    about: {
        type: String,
    },
    skills: {
        type: [String],
    }
}, 
{timestamps: true}
);

const User=mongoose.model('user', userSchema);

module.exports={
    User,
}