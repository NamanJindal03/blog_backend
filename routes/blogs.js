const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blog');
const {verifyAndFetchUser} = require('../middlewares/verifyAndFetchUser');
const {verifyBlogCreator} = require('../middlewares/verifyBlogCreator');

router.post('/', verifyAndFetchUser, blogsController.addBlogs);
router.put('/:id', verifyAndFetchUser, verifyBlogCreator, blogsController.updateBlog);
router.delete('/:id', verifyAndFetchUser, verifyBlogCreator, blogsController.deleteBlog);
router.post('/:blogId/comment',verifyAndFetchUser, blogsController.addComment )

module.exports = router;