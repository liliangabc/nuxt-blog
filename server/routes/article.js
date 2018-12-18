/**
 * 文章管理模块
 */

const express = require('express')
const trimHtml = require('trim-html')
const Article = require('../models/article')
const Collect = require('../models/collect')
const { checkAuth } = require('../middleware')
const utils = require('../utils')
const constants = require('../utils/constants')

const router = express.Router()

/**
 * 验证文章标题
 * @param {String} str 
 */
const invalidTitle = str => utils.isEmpty(str) && '文章标题不能为空'

/**
 * 验证文章内容
 * @param {String} str 
 */
const invalidContent = str => utils.isEmpty(str) && '文章内容不能为空'

const validData = (req, res, next) => {
  let { title, content } = req.body
  let validResult = invalidTitle(title) || invalidContent(content)
  if (validResult) {
    res.status(403).send(validResult)
  } else {
    next()
  }
}

/**
 * 获取一篇文章
 */
router.get('/', (req, res) => {
  let { id } = req.query
  Article.findById(id).select('-__v').populate({
    path: 'user',
    select: 'userName _id'
  }).exec((err, data) => {
    if (err) {
      res.status(500).send(constants.DB_ERROR)
    } else {
      res.json({
        info: constants.GET_SUCCESS, data
      })
    }
  })
})

/**
 * 新增文章
 */
router.post('/add', checkAuth, validData, (req, res) => {
  let { user } = req.session
  let { title, content, poster } = req.body
  let summary = trimHtml(content, { wordBreak: true, preserveTags: false }).html
  poster = utils.isStr(poster) ? poster : ''
  Article.create({
    title, content, summary, poster, user: user._id
  }, (err, doc) => {
    if (err) {
      console.log(err.message)
      res.status(500).send(constants.DB_ERROR)
    } else {
      res.json({ info: constants.POST_SUCCESS, data: doc })
    }
  })
})

/**
 * 删除文章 一篇或多篇
 */
router.delete('/del', checkAuth, (req, res) => {
  let { ids } = req.body
  if (Array.isArray(ids)) {
    Article.deleteMany().where('_id').in(ids).exec(err => {
      if (err) {
        return res.status(500).send(constants.DB_ERROR)
      } else {
        res.json({ info: constants.DEL_SUCCESS })
      }
    })
  } else {
    Article.deleteOne({ _id: ids }, err => {
      if (err) {
        return res.status(500).send(constants.DB_ERROR)
      } else {
        res.json({ info: constants.DEL_SUCCESS })
      }
    })
  }
})

/**
 * 更新文章
 */
router.post('/update', checkAuth, validData, (req, res) => {
  let { title, content, poster, id } = req.body
  poster = utils.isStr(poster) ? poster : ''
  let summary = trimHtml(content, { wordBreak: true, preserveTags: false }).html
  Article.findByIdAndUpdate(
    id,
    { title, content, summary, poster, 'meta.updateAt': new Date() },
    (err, data) => {
      if (err) {
        res.status(500).send(constants.DB_ERROR)
      } else {
        res.json({ info: constants.UPDATE_SUCCESS, data })
      }
    }
  )
})

/**
 * 获取所有文章列表
 */
async function getAllList(req, res) {
  let { pageNum = 1, pageSize = 10 } = req.query
  let skipCount = (pageNum - 1) * pageSize
  try {
    let total = await Article.estimatedDocumentCount()
    let data = await Article.aggregate().project({
      favCount: { $size: { $ifNull: ['$collects', []] } },
      title: 1,
      summary: 1,
      poster: 1
    }).skip(skipCount).limit(pageSize)
    res.json({ info: constants.GET_SUCCESS, data, total })
  } catch (err) {
    return res.status(500).send(constants.DB_ERROR)
  }
}
router.get('/all_list', getAllList)

/**
 * 获取我的文章列表
 */
router.get('/list', checkAuth, (req, res) => {
  let { user } = req.session
  let { pageNum = 1, pageSize = 10 } = req.query
  let skipCount = (pageNum - 1) * pageSize
  let conditions = { user: user._id }
  Article.estimatedDocumentCount(conditions, (err, total) => {
    if (err) {
      return res.status(500).send(constants.DB_ERROR)
    }
    Article.find(conditions).skip(skipCount).limit(pageSize).select('-__v -content').exec((err, data) => {
      if (err) {
        res.status(500).send(constants.DB_ERROR)
      } else {
        res.json({ info: constants.GET_SUCCESS, data, total })
      }
    })
  })
})

/**
 * 收藏和取消收藏
 */
async function toggleCollect(req, res) {
  let { user } = req.session
  let { id } = req.body
  let conditions = { user: user._id, article: id }
  try {
    let doc = await Collect.findOneAndDelete(conditions)
    if (doc) {
      let article = await Article.findById(id)
      if (article) {
        article.collects.splice(article.collects.indexOf(id), 1)
        await article.save()
        res.json({ info: constants.DEL_SUCCESS })
      }
    } else {
      let doc = new Collect(conditions)
      await doc.save()
      await Article.findByIdAndUpdate(id, { $push: { collects: doc._id } })
      res.json({ info: constants.ADD_SUCCESS })
    }
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
}
router.post('/toggle_collect', checkAuth, toggleCollect)

module.exports = router