const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Blog = require('./Blog');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    later: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: String,
})

userSchema.pre('save', async function(next){
    console.log(this);
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 12);
    next()
})
module.exports = mongoose.model('User', userSchema)