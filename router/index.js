const express=require('express');
const router=express.Router()
const passport=require('passport')

//controllers

const userController=require('../controller/User.controller')
const conclaveController=require('../controller/Conclave.controller')

//middlewares

const userCheck=require('../middleware/UserCheck')
const conclaveCheck=require('../middleware/ConclaveCheck')

//user routes

router.post('/users/signin',userController.signinUser)
router.post('/users/signup',userController.signupUser)
router.post('/users/password',userController.changePassword)

//conclave routes

router.get('/conclaves',passport.authenticate('jwt',{session:false}),conclaveController.getAllConclaves)
router.get('/conclaves/:id',passport.authenticate('jwt',{session:false}),userCheck,conclaveController.getUserConclave)
router.post('/conclaves/:id',passport.authenticate('jwt',{session:false}),userCheck,conclaveController.createConclave)
router.put('/conclaves/:conclaveId/visibility',passport.authenticate('jwt',{session:false}),conclaveCheck,conclaveController.changeConclaveVisibility)
router.put('/conclaves/:conclaveId/users/:id',passport.authenticate('jwt',{session:false}),conclaveCheck,userCheck,conclaveController.addBookmark)

//messages routes

router.get('/messages/:conclaveId',passport.authenticate('jwt',{session:false}),conclaveCheck,conclaveController.getAllConclaveMessages);

module.exports=router