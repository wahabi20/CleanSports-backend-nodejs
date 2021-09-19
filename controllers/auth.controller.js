
const bcrypt=require('bcrypt');
const {User}= require('../models/user');
const functions = require('../functions/validates ');

const validateLogin= functions.validateLogin;




/* User authentification  */ 
module.exports.authentication =  async (req,res)=>{
    const {error} = validateLogin(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('invalid email.');
    const validPassword= await bcrypt.compare(req.body.password, user.password); 
    if(!validPassword)return res.status(400).send('invalid password');
    const token=user.generateAuthToken();
    res.status(200).send({user,token})

}




