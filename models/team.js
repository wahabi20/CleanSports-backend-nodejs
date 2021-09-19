const Joi = require("joi");
const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    logo:{
        type: String,
        default:"https://graphiste.com/blog/wp-content/uploads/2017/04/logo-auto-2.png"
      },
    pts:{
       type: Number,
       default: 0 
    },
    isActive:{
        type: Boolean,
        default: true
    },
    userId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    }],
    matchs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Match",
        },
      ],
  },
  { timestamps: true }
);

const Team = new mongoose.model("Team", TeamSchema);

function validateTeam(team) {
  const schema = {
    name: Joi.string().min(5).max(80),
    pts: Joi.number(),
    isActive: Joi.boolean(),
   
  };

  return Joi.validate(team, schema);
}

exports.Team= Team;
exports.validate = validateTeam;
