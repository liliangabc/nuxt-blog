const mongoose = require('mongoose')

const verifCodeSchema = new mongoose.Schema({
  email: String,
  captcha: String,
  createdDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('verifcodes', verifCodeSchema)