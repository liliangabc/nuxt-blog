/**
 * 路由根模块
 */

const express = require('express')
const svgCaptcha = require('svg-captcha')

const userRouter = require('./user')
const qnRouter = require('./qn')
const articleRouter = require('./article')

const router = express.Router()

/**
 * 生成验证码
 */
router.get('/captcha', (req, res) => {
  let captcha = svgCaptcha.create()
  req.session.captcha = captcha.text.toLowerCase()
  res.type('svg').send(captcha.data)
})

module.exports = app => {
  app.use('/api/user', userRouter)
  app.use('/api/qn', qnRouter)
  app.use('/api/article', articleRouter)
  app.use('/api', router)
}