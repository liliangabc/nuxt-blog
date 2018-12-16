/**
 * 文章管理模块
 */

const express = require('express')
const Article = require('../models/article')
const utils = require('../utils')
const constants = require('../utils/constants')

const router = express.Router()

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
router.post('/add', (req, res) => {
  let { user } = req.session
  let { title, content, poster } = req.body
  poster = utils.isStr(poster) ? poster : ''
  // 检查会话
  if (!user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
  // 验证数据
  let titleEmpty = utils.isEmpty(title) && '文章标题不能为空'
  let contentEmpty = utils.isEmpty(content) && '文章内容不能为空'
  let validResult = titleEmpty || contentEmpty
  if (validResult) {
    return res.status(403).send(validResult)
  }
  // 保存入库
  Article.create({
    title, content, poster, user: user._id
  }, (err, doc) => {
    if (err) {
      res.status(500).send(constants.DB_ERROR)
    } else {
      res.json({ info: constants.POST_SUCCESS, data: doc })
    }
  })
})

/**
 * 删除文章 一篇或多篇
 */
router.delete('/del', (req, res) => {
  // 检查会话
  let { user } = req.session
  let { ids } = req.body
  if (!user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
  // 删除
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
router.post('/update', (req, res) => {
  // 检查会话
  let { user } = req.session
  let { title, content, poster } = req.body
  if (!user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
  // 验证数据

  // 更新数据
  
})

/**
 * 获取所有文章列表
 */
router.get('/all_list', (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.query
  let skipCount = (pageNum - 1) * pageSize
  Article.estimatedDocumentCount((err, total) => {
    if (err) {
      return res.status(500).send(constants.DB_ERROR)
    }
    Article.find().skip(skipCount).limit(pageSize).select('-__v').populate({
      path: 'user',
      select: 'userName _id'
    }).exec((err, docs) => {
      if (err) {
        res.status(500).send(constants.DB_ERROR)
      } else {
        res.json({
          info: constants.GET_SUCCESS,
          data: docs,
          total
        })
      }
    })
  })
})

/**
 * 获取我的文章列表
 */
router.get('/list', (req, res) => {
  let { user } = req.session
  let { pageNum = 1, pageSize = 10 } = req.query
  // 检查会话
  if (!user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
  // 查询
  let skipCount = (pageNum - 1) * pageSize
  let conditions = { user: user._id }
  Article.estimatedDocumentCount(conditions, (err, total) => {
    if (err) {
      return res.status(500).send(constants.DB_ERROR)
    }
    Article.find(conditions).skip(skipCount).limit(pageSize).select('-__v').exec((err, docs) => {
      if (err) {
        res.status(500).send(constants.DB_ERROR)
      } else {
        res.json({
          info: constants.GET_SUCCESS,
          data: docs,
          total
        })
      }
    })
  })
})

module.exports = router