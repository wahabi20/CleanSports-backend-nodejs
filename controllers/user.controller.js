
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");





/* add user  */
module.exports.addUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  let user = await User.findOne({
    email: req.body.email,
  });
  if (user) return res.status(400).send("user aleardy registred . ");


  user = new User(_.pick(req.body, ["first_Name","last_Name","email","password","password_Confirm","isAdmin","isActive","address","dateOfBirth","phone_Number"]));
  
  if( typeof req.file === 'undefined' || req.file.length === 0){
    const default_logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xSz0eMW7GmpKukczOHvPWWGDqaBCqWA-Mw&usqp=CAU"
    await user.set("logo", default_logo);
  }
  else{

     const logo =  req.file.filename;
  
     await user.set('logo',logo); 
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password,salt);
  user.password_Confirm = await bcrypt.hash(user.password_Confirm,salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header("access_token", token).send(_.pick(user, ["id", "first_Name","last_Name","email","address","isAdmin","isActive","dateOfBirth","phone_Number","logo"]));
}
