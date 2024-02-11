const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Tag = require("../models/Tag");
const User = require("../models/User");


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
    const blogId = req.params.id;
    const {title, description, tag, imageUrl} = req.body;
    try{
        const blog = await Blog.findById(blogId);
        const oldBlogTags = blog.tag;
        console.log(oldBlogTags);
        if(title) blog.title = title;
        if(description) blog.description = description;
        if(tag) blog.tag = tag;
        if(imageUrl) blog.imageUrl = imageUrl;

        await Blog.findByIdAndUpdate(blogId, blog);

        if(tag){
            
            oldBlogTags.forEach(async (tagValue) => {
                const existingTag = await Tag.findOne({categoryName: tagValue})
                if(existingTag){
                    existingTag.category.pull(blog._id);
                    await existingTag.save();
                }
            });
            console.log('burst 1')
            tag.forEach(async (tagValue) => {
                const existingTag = await Tag.findOne({categoryName: tagValue})
                if(existingTag){
                    existingTag.category.push(blog._id);
                    await existingTag.save();
                }
                else{
                    const newTag = await Tag.create({categoryName: tagValue, category: [blog._id]})
                }
            });
            console.log('burst 2')

        }
        res.status(200).json({status: "success", message: "Blog updated successfully"})
    }
    catch(err){
        console.log(`Error: ${err}`);
        return res.status(400).json({status: "error", message: "something went wrong"})
    }

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

async function addComment(req, res) {
    const {blogId } = req.params;
    const {message, commentId} = req.body;
    //if no commentId that means we are writing a new comment chain.
    //req.user -> req.user.id
    try{
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({message: 'Blog not found'})
        }
        const newComment = await Comment.create({
            user: req.user.id,
            message,
            like: 0,
            isNested: !!commentId,
            parentComment: commentId,
            blog: blogId,
            comments: []
        })
        if(commentId){
            const parentComment = await Comment.findById(commentId);
            if(!parentComment){
                return res.status(404).json({message: 'Comment not found'})
            }
            parentComment.comments.push(newComment._id);
            await parentComment.save();
        }
        else{
            blog.comments.push(newComment._id);
            await blog.save();
        }
        res.status(200).json({status: "success", message: "comment added succesfully"})
    }
    catch(err){
        console.log(err);
        return res.status(400).json({status: "error", message: "something went wrong"})
        
    }
}
module.exports = {addBlogs, updateBlog, deleteBlog, addComment}

// /blog/vote -> patch 
/* 
    req.body = {vote: true or false}

    true, 


    first validate whether the user has voted before or not, -> \
    if voted before -> throw error that already voted cannot vote again

    true or false, 
    increament the count of upvote or downvote 

    votedBy -> array -> 


    if(upvote) -> 

*/