const Blog = require("../models/Blog");
const User = require("../models/User");

async function verifyBlogCreator(req, res, next){
    const userId = req.user.id;
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({status: 'error', message: "Blog not found"});
    }
    if(blog.user != userId){
        return res.status(403).json({status: "error", message: "you do not have permission to make changes to this blog"})
    }
    next();
}

module.exports = {verifyBlogCreator}