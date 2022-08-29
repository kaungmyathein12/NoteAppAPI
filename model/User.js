const mongoose = require("mongoose");
const Joi = require("joi");

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dianqv0gp/image/upload/v1661577891/NoteApp/pf_efzuna.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

exports.User = mongoose.model("User", userSchema);

exports.validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(4).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
};
