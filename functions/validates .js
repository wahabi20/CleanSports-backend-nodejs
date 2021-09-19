
const Joi =require('joi');


/* validate schema of User & Partner login */
exports.validateLogin= function(req){
    const schema ={
        email:Joi.string().min(5).max(255).required(),
        password:Joi.string().min(5).max(255).required()
        };
        return Joi.validate(req,schema);
}



