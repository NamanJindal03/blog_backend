const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT;

async function loginUser(req, res){
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({status: "error", message: "cannot find any user with the provided username"});
        }
        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({status: "error", message: "Either username or password is incorrect"});
        }
       
        const authToken = jwt.sign({email: user.email, id: user._id}, secretKey);
        return res.status(200).json({status: "success", user, authToken})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({status: "error", message: "Internal Server Error"})
    }
}
async function createUser(req, res){
    const {username, email, password} = req.body;
    console.log(secretKey);
    try{
        const newUser = await User.create({username, email, password});
        const authToken = jwt.sign({email, id: newUser._id}, secretKey);
        res.status(201).json({status: "success", user: newUser, authToken})
    }   
    catch(err){
        res.status(400).json({status: 'error', message: `Error - ${err}`})
    }

}
module.exports = {loginUser, createUser}
module.exports = {loginUser, createUser}