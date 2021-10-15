
const { User } = require("../models/user");




/* get the total statisticals */
module.exports.getUsersStat = async (req,res) => {
  
    await User.find({
    "isAdmin":false
  })
    .then( async (users) => {
       
        const userActives= users.filter(
          (user) => user.isActive == true
          
        )
        const userDesactive= users.filter(
          (user) => user.isActive == false
          
        )
      
        res.status(200).json(
            {
            
             TotalUsers: users.length,
             userActives: userActives.length,
             userDesactive: userDesactive.length,
            
            })
           
        })
        .catch((errors) => {
            res.status(404).send(errors);       
          });
    
   
  }
  