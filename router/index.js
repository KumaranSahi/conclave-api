const express=require('express');
const router=express.Router()
const passport=require('passport')

const userController=require('../controller/User.controller')

router.post('/users/signin',userController.signinUser)
router.post('/users/signup',userController.signupUser)
router.post('/users/password',userController.changePassword)

module.exports=router