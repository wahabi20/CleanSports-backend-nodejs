const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const getkeyPass = require('./../startup/config').getKeyPass();
const UserSchema = new mongoose.Schema(
  {
    first_Name: {
      type: String,
      
    },
    last_Name: {
      type: String,
      
    },
    email: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      
    },
    pts:{
      type: Number,
      default: 0
    },
    logo:{
      type: String,
      default:"https://graphiste.com/blog/wp-content/uploads/2017/04/logo-auto-2.png"
    },
    password: {
      type: String,
     
    },
    password_Confirm: {
      type: String,
     
    },
    dateOfBirth: {
      type: String,
      
    },
    phone_Number: {
      type: Number,
      
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    nbPlayer:{
      type: Number
    },
    teamId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      
    }],
    matchs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
    resetLink: {
       data: String,
       default: ''
    }
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, isActive: this.isActive },
    getkeyPass,
    { expiresIn: "7 days" }
  );
  return token;
};
const User = new mongoose.model("User", UserSchema);

function validateUser(user) {
  const schema = {
    first_Name: Joi.string().min(3).max(50).required(),
    last_Name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(1024).required(),
    password_Confirm: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.boolean(),
    isActive: Joi.boolean(),
    address: Joi.string().min(5).max(100).required(),
    dateOfBirth: Joi.string().min(5).max(50).required(),
    phone_Number: Joi.number().required(),
    pts: Joi.number()
  };
  return Joi.validate(user, schema);
}

exports.UserSchema = UserSchema;
exports.User = User;
exports.validate = validateUser;
