/**
 * 文章管理模块
 */

const express = require('express')
const trimHtml = require('trim-html')
const { ObjectId } = require('mongoose').Types
const Article = require('../models/article')
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
router.get('/', async (req, res) => {
  try {
    let data = await Article.findById(req.query.id).select('-__v -collects').populate('user', 'userName _id')
    res.json({ info: constants.GET_SUCCESS, data })
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
})

/**
 * 新增文章
 */
router.post('/add', checkAuth, validData, async (req, res) => {
  let { user } = req.session
  let { title, content, poster } = req.body
  let summary = trimHtml(content, { wordBreak: true, preserveTags: false }).html
  poster = utils.isStr(poster) ? poster : ''
  try {
    await Article.create({ title, content, summary, poster, user: user._id })
    res.json({ info: constants.POST_SUCCESS })
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
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
router.get('/all_list', async (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.query
  let skipCount = (pageNum - 1) * pageSize
  let userId = req.session.user ? req.session.user._id : null
  try {
    let total = await Article.estimatedDocumentCount()
    let data = await Article.aggregate().skip(skipCount).limit(pageSize).lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'u'
    }).unwind({
      path: '$u',
      preserveNullAndEmptyArrays: true
    }).addFields({
      user: {
        userName: '$u.userName',
        _id: '$u._id'
      },
      isFav: { $in: [ObjectId(userId), '$collects'] },
      favCount: { $size: { $ifNull: ['$collects', []] } }
    }).project('title summary poster meta user isFav favCount')
    res.json({ info: constants.GET_SUCCESS, data, total })
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
})

/**
 * 获取我的文章列表
 */
router.get('/list', checkAuth, async (req, res) => {
  let user = req.session.user._id
  let { pageNum = 1, pageSize = 10 } = req.query
  let skipCount = (pageNum - 1) * pageSize
  try {
    let total = await Article.estimatedDocumentCount({ user })
    let data = await Article.aggregate().match({
      user: ObjectId(user)
    }).skip(skipCount).limit(pageSize).project({
      isFav: { $in: [ObjectId(user), '$collects'] },
      favCount: { $size: { $ifNull: ['$collects', []] } },
      title: 1,
      summary: 1,
      poster: 1,
      meta: 1
    })
    res.json({ info: constants.GET_SUCCESS, data, total })
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
})

/**
 * 获取我收藏的文章列表
 */
router.get('/collect_list', checkAuth, async (req, res) => {
  let userId = req.session.user._id
  let { pageNum = 1, pageSize = 10 } = req.query
  let skipCount = (pageNum - 1) * pageSize
  let condition = { collects: { $elemMatch: { $eq: ObjectId(userId) } } }
  try {
    let total = await Article.countDocuments(condition)
    let data = await Article.aggregate().match(condition).skip(skipCount).limit(pageSize).lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'u'
    }).unwind({
      path: '$u',
      preserveNullAndEmptyArrays: true
    }).addFields({
      favCount: { $size: { $ifNull: ['$collects', []] } },
      user: {
        userName: '$u.userName',
        _id: '$u._id'
      }
    }).project('title summary poster meta user favCount')
    res.json({ info: constants.GET_SUCCESS, data, total })
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
})

/**
 * 收藏和取消收藏
 */
router.post('/toggle_collect', checkAuth, async (req, res) => {
  let userId = req.session.user._id
  let articleId = req.body.id, isAdd = false
  try {
    let article = await Article.findById(articleId)
    let curIndex = article.collects.indexOf(userId)
    if (curIndex !== -1) {
      article.collects.splice(curIndex, 1)
    } else {
      isAdd = true
      article.collects.push(userId)
    }
    await article.save()
    res.json({ info: isAdd ? constants.ADD_SUCCESS : constants.DEL_SUCCESS })
  } catch (err) {
    res.status(500).send(constants.DB_ERROR)
  }
})

module.exports = router