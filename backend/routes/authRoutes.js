const express = require('express');
const { Signup, Signin, getUser, Logout } = require('../controllers/authController');
const jwtAuth = require('../middleware/jwtAuth');

const authRouter = express.Router();



authRouter.post('/signup',Signup);
authRouter.post('/signin',Signin);
authRouter.get('/getuser',jwtAuth,getUser);
authRouter.get('/logout',jwtAuth,Logout);


module.exports = authRouter;