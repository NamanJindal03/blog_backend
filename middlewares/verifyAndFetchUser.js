const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT;
async function verifyAndFetchUser(req, res, next){
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({status: "failed", message: "Authorization required"});
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            console.error(err); //later on can be added to log files and logging servors
            return res.status(401).json({status: "failed", message: `Invalid token, error: ${err}`})
        }
        req.user = decoded;
        console.log(req.user);
        next();
    })
}

module.exports = {verifyAndFetchUser}