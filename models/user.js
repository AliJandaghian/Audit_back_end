const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config")
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 3,
    maxlenght: 50,
  },
  department: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlenght: 2,
        maxlenght: 10,
      },
    }),
    required: true,
  },
  email: {
    type: String,
    unique: true,
    Required: true,
    minlenght: 6,
    maxlenght: 255,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlenght: 6,
    maxlenght: 1050,
    trim: true,
  },
  isAuditor: Boolean,
  isManager: Boolean,
  isAdmin: Boolean,
});

const User = new mongoose.model("user", userSchema);

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    isAuditor: this.isAuditor,
    isManager: this.isManager,
    isAdmin: this.isAdmin,
  },
  config.get('jetPrivateKey')
  );
};
