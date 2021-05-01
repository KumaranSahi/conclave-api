const express=require('express');
const router=express.Router()
const passport=require('passport')

//controllers

const userController=require('../controller/User.controller')
const conclaveController=require('../controller/Conclave.controller')

//middlewares

const userCheck=require('../middleware/UserCheck')

//user routes

router.post('/users/signin',userController.signinUser)
router.post('/users/signup',userController.signupUser)
router.post('/users/password',userController.changePassword)

//conclave routes

router.get('/conclaves',passport.authenticate('jwt',{session:false}),conclaveController.getAllConclaves)
router.get('/conclaves/:id',passport.authenticate('jwt',{session:false}),userCheck,conclaveController.getUserConclave)
router.post('/conclaves/:id',passport.authenticate('jwt',{session:false}),userCheck,conclaveController.createConclave)

module.exports=router