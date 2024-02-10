const User = require("../models/User")
async function getUserDetails(req, res){
    const userId = req.user.id;
    try{
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({status: "error", message: "Something went wrong"})
        }
        return res.status(200).json({status: "success", user})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({status: "error", message: "Internal Server Error"})
    }
}

module.exports = {getUserDetails}