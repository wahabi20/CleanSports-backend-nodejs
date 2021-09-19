
const express=require('express');
const router=express.Router();

const authController = require('../controllers/auth.controller');


/* login users */
router.post('/login', authController.authentication);






module.exports=router;