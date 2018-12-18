/**
 * 文章收藏模型
 */

const mongoose = require('mongoose')

const { Schema } = mongoose

const collectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'articles',
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('collects', collectSchema)