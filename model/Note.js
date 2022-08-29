const mongoose = require("mongoose");
const Joi = require("joi");

let noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

exports.Note = mongoose.model("Note", noteSchema);

exports.validateNote = (note) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(3).required(),
    userId: Joi.string().min(4).required(),
  });
  return schema.validate(note);
};
