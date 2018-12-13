const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  email: String,
  isActivated: Boolean,
  activateInfo: {
    code: String,
    date: Date
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('users', userSchema)