
const { User } = require("../models/user");
const {Team, validate } = require("../models/team");







/* add new team */
module.exports.addTeam = async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   console.log("nbplayer>>>",req.body.nbPlayer) 
    
  
      
      const team = new Team({
       
        name: req.body.name,
        nbPlayer: req.body.nbPlayer,
        userId: req.body.userId,
        addedBy: req.user._id,
        
      });

    if( typeof req.file === 'undefined' || req.file.length === 0){
        const default_logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xSz0eMW7GmpKukczOHvPWWGDqaBCqWA-Mw&usqp=CAU"
        await team.set("logo", default_logo);
      }
      else{
    
         const logo =  req.file.filename;
      
         await team.set("logo",logo); 
      }

  
        await team.save().then(async (result) => {
            console.log("team>>>",result)
          User.findOne({ _id: req.user._id })
            .then(async (user) => {
                console.log("user>>>", user)
              await user.teamId.push(result);
               user.save();
            })
            .then((result) => {
                    res.status(201).json({
                    message: "Created team successfully !",
                    team: team,
                    addedBy: req.user._id,
                  
                  });
                 }) 
                .catch((errors) => {
                  console.log(errors);
                  res.status(500).json({
                    error: errors,
                  });
                })
  
               .catch((errors) => {
                console.log(errors);
                res.status(500).json({
                  error: errors,
                });
              });
  
            } )   
            
        }

/* get team by owner */
module.exports.getUserTeam = async (req,res) => {

  try{
      let id = req.user._id;
      

      let team = await User.findOne({_id: id }).select("-password -password_Confirm")
      .populate([
        {
          path: 'teamId',
          model: 'Team',
          select: 'name pts nbPlayer logo',
          populate: {
            path: 'userId',
            model: 'User',
            select: 'first_Name last_Name pts logo',
          }
        },
      ]);
     
      res.status(200).json([{
        
        team: team
      }]);
  }catch (err) {
    res.status(500).send(err)
  }
  
}
