const mongoose = require('mongoose')

const { Schema } = mongoose 

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  isActivated: Boolean,
  activateInfo: {
    code: String,
    date: Date
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'articles'
    }
  ]
})

module.exports = mongoose.model('users', userSchema)