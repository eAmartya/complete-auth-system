const mongoose = require("mongoose");
const { Schema } = mongoose;
const authSchema = new Schema({
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false }
})
const Users = mongoose.model('users', authSchema);
module.exports = Users;