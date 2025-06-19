const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: [String], default: ['user'] }
});
const User = mongoose.model.User || mongoose.model("User",userSchema) 
module.exports = User;