const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const {verifyAndFetchUser} = require("../middlewares/verifyAndFetchUser")

router.post('/', authController.createUser);
router.post('/login', authController.loginUser);
router.get('/',verifyAndFetchUser,  userController.getUserDetails);

module.exports = router;