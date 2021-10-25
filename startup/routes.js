const express=require('express');

const users=require('../routers/users');
const auth=require('../routers/auth');
const statisticals = require('../routers/statisticals');
const team = require('../routers/team');
module.exports=function(app){
    app.use(express.json());
   
    app.use('/cleansports/api/users/',users);
    app.use('/cleansports/api/auth',auth);
    app.use('/cleansports/api/statisticals',statisticals);
    app.use('/cleansports/api/team',team);
  

}