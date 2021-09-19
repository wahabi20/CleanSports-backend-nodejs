const Joi = require("joi");
const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    type: {
        type: String,
        required: false,
     },
    result: {
      type: String,
      required: false,
    },
    state:{
       type: String,
       required: false,
    },
    teamId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      
    }]
  },
  { timestamps: true }
);

const Match = new mongoose.model("Match", MatchSchema);

function validateMatch(match) {
  const schema = {
    type: Joi.string().min(5).max(80),
    result: Joi.string().required(),
    state: Joi.string().required(),
   
  };

  return Joi.validate(match, schema);
}

exports.Match= Match;
exports.validate = validateMatch;
