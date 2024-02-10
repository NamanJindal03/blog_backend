const Blog = require("../models/Blog");
const Tag = require("../models/Tag");
const User = require("../models/User")

async function addBlogs(req, res){
    const userId = req.user.id;
    const {title, description, tag, imageUrl} = req.body;
    const documentObject = {};
    if(tag) documentObject.tag = tag
    if(imageUrl) documentObject.imageUrl = imageUrl;

    try{
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({status: "error", message: "Something went wrong"})
        }
        const newBlogPost = await Blog.create({
            ...documentObject,
            title,
            description,
            user: userId,
            username: user.username,
            upvote: 0,
            downvote: 0,
            votedBy: [],
            comments: [],
        })

        if(tag?.length > 0){
            tag.forEach(async (tagValue) => {
                const existingTag = await Tag.findOne({categoryName: tagValue})
                if(existingTag){
                    existingTag.category.push(newBlogPost._id);
                    await existingTag.save();
                }
                else{
                    const newTag = await Tag.create({categoryName: tagValue, category: [newBlogPost._id]})
                }
            });
        }
        res.status(201).json({status: "success", message: "Blog post added succesfully"});
    }
    catch(err){
        console.error(err)
        return res.status(400).json({status: "error", message: "something went wrong"})
    }

}
async function updateBlog(req, res){
    
}
async function deleteBlog(req, res){
    const blogId = req.params.id;
    try{
        await Blog.findByIdAndDelete(blogId);
        return res.status(200).json({status: "success", message: "Blog post deleted succesfully"});
    }
    catch(err){
        console.error(err)
        return res.status(400).json({status: "error", message: "something went wrong"})
    }
}

module.exports = {addBlogs, updateBlog, deleteBlog}