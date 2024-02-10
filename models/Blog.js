const mongoose = require('mongoose');

const blogsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
    },
    description: {
        type: String,
        required: true,
        min: 3,
    },
    tag: {
        type: [String],
        default: ['General'],
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, //who created this blog
        ref: 'User',
    },
    username: String,
    upvote: Number,
    downvote: Number,
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId, //number of people who voted on this blog
        ref: 'User',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
})

module.exports = mongoose.model('Blog', blogsSchema)