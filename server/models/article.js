const mongoose = require('mongoose')

const { Schema } = mongoose

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: String,
  poster: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
      type: Date,
      default: Date.now
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'favorites'
    }
  ]
})

module.exports = mongoose.model('articles', articleSchema)