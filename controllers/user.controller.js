
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User, validate } = require("../models/user");
const { ObjectID } = require("mongodb");


/* add user  */
module.exports.addUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
   await User.findOne({
    email: req.body.email,
  }).then( async (dataUser) => {
    
  if (dataUser) {
    return res.status(404).json({
      message: "user already register",
    });

   }
    const user = new User(_.pick(req.body,
       ["first_Name","last_Name","email","password",
        "password_Confirm","isAdmin","isActive",
        "address","dateOfBirth","phone_Number","pts"]));
  
  if( typeof (req.file === 'undefined') || (req.file.length === 0)){
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
  res.header("access_token", token).send(_.pick(user, ["id", "first_Name","last_Name","email","address","isAdmin","isActive","dateOfBirth","phone_Number","logo", "pts"]));
  }).catch(err => {
     console.log(err)
  })

}

/* get the list of all users */
module.exports.getUsers = async (req, res) => {
  
  const { page , limit} = req.query;

    await User.find({
      "isAdmin":false
    })
      .then((users) => {
        const total_pages = users.length / limit ;
        const data = users.slice((page - 1) * limit, page * limit);
         res.status(200).json({
            message: "list of users",
            page: page,
            per_page: limit,
            total: users.length,
            total_pages : Math.ceil(total_pages),
            result: data
          })
      })
      .catch((errors) => {
        res.status(404).send(errors);       
      });
      
  }

  /* get user by id */
module.exports.getUser = async (req, res) => {
  let id = req.params.id
  console.log(id)
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Id not valid");
  }

  await User.findOne({_id: id}).select("-password -password_Confirm")
  .then(user => {

    console.log(user)
             res.status(200).json([{
                 message: "User informatins",

                 data:{
                     'id': user._id,
                     'isAdmin': user.isAdmin,
                     'isActive': user.isActive,
                     'first_Name': user.first_Name,
                     'last_Name': user.last_Name,
                     'email': user.email,
                     'dateOfBirth': user.dateOfBirth,
                     'phone_Number': user.phone_Number,
                     'address': user.address,
                     'pts': user.pts

                 },
 
    }])})
     .catch(err => {
      res.status(500).json({
           error: err
      })
  });
}

/* update user */
module.exports.updateUser = (req, res) => {
 
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Id not valid");
  }
  
  User.findOne({
    _id: id,
  })
    .then(async (user) => {
 
   if( typeof req.file === 'undefined' || req.file.length === 0){
     const default_logo = user.logo
     await user.set("logo", default_logo);
   }
   else{
      const logo =  req.file.filename;
      await user.set('logo',logo); 
   }
      user.set("first_Name", req.body.first_Name);
      user.set("last_Name", req.body.last_Name);
      user.set("email", req.body.email);
      user.set("address", req.body.address);
      user.set("dateOfBirth", req.body.dateOfBirth);
      user.set("phone_Number", req.body.phone_Number);
      user.set("pts", req.body.pts);
      await user.save();
      res.status(201).send(user);
    })
    .catch((errors) => {
      res.status(404).send(errors);
    });
 }
 

/* delete user */
module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Id not valid");
  }

  User.findOne({
    _id: id,
  })
    .then(async (user) => {
      await user.delete();
      res.status(200).send({
        message: " user have been deleted successfuly ",
      });
    })
    .catch((errors) => {
      res.status(404).send(errors);   
    });
}



/* forgot password  */
module.exports.forgotPassword = async (req, res) => {

  const {email} = req.body;

  User.findOne({email}).then(user => {

    if (!user){
       return res.status(400).json({err: "User with this email does not exists."});
    }
   
    const token = jwt.sign({_id: user._id},process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});


  let mailOption = {
    from: 'wahabi.contact.tech@gmail.com',
    to: email,
    subject: 'Reset password',
    html: `
    <div><h2>Please click on given link to reset your password</h2>
    <pre>http://localhost:4200/users/reset?token=${token}</pre>
    </div>
    
   `
  }

 //console.log("token>>>", token)

  return user.updateOne({resetLink: token}).then(result => {
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {

        user: process.env.EMAIL,
        pass: process.env.PASSWORD,

      }
    });

    transporter.sendMail(mailOption)
    .then( resonse => {
       res.status(200).json({
          message: 'Email has been sent',
          token : token
       });
    }).catch(error => {
       res.status(400).send(error);
    })
  })
  
})
 
      

}



 /* reset Password */
module.exports.resetPassword = async (req, res) => {

  const {newPass, newPassConfirm} = req.body;
  const resetLink = req.params;
  let resetLink_token = resetLink.token;
   console.log("token>>>",resetLink_token)
  
  if(resetLink.token){
     
       jwt.verify(resetLink.token,process.env.RESET_PASSWORD_KEY, function (error, decodedData){
         if(error){
             return res.status(401).json({
               error: "Incorrect token or it is expired"
             })
         }

        User.findOne({resetLink: resetLink_token}).then( async user => {
       
           if(!user){
              return res.status(400).json({
                error: "User with this token does not exist"
              });
           }
          
  
     const us = await User.findByIdAndUpdate(
          { _id: user._id },
          { password: newPass , 
            resetLink: '',
            password_Confirm : newPassConfirm
          },
          { new: true }
        );

          const salt = await bcrypt.genSalt(10);
          us.password = await bcrypt.hash(us.password, salt);
          us.password_Confirm = await bcrypt.hash(us.password_Confirm, salt);
         
           us.save().then(response => {
              res.status(200).json({ message: "Your password has been changed"});
           }).catch(err => {
              res.status(400).json({ error: "reset password error"});
           })
           

        })
       })

      
     }else {
        console.log("error: resetLink not exist!");
     }
  }

