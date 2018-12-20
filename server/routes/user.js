/**
 * 用户路由模块
 */

const express = require('express')
const crypto = require('crypto')
const User = require('../models/user')
const VerifCode = require('../models/verif_code')
const utils = require('../utils')
const validator = require('../utils/validator')
const constants = require('../utils/constants')
const mailUtils = require('../utils/mail')

const router = express.Router()

/**
 * 用户注册
 */
router.post('/register', async (req, res, next) => {
  let { userName, email, password, captcha } = req.body
  let validResult = validator.validUserName(userName) ||
    validator.validEmail(email) ||
    validator.validPwd(password) ||
    validator.validCaptcha(captcha, req)
  delete req.session.captcha
  if (validResult) return res.status(403).send(validResult)
  email = email.trim()
  userName = userName.trim()
  try {
    let user = await User.findOne().or([{ userName }, { email }])
    if (user) {
      return res.status(403).send(user.userName === userName ? constants.USER_USED : constants.EMAIL_USED)
    }
    let code = await mailUtils.sendActivateMail(req, email)
    password = crypto.createHash('md5').update(password).digest('hex')
    await User.create({ userName, password, email, activateInfo: { code } })
    res.json({ info: constants.REGISTER_SUCCESS })
  } catch (err) {
    next(err)
  }
})

/**
 * 用户激活
 */
router.post('/activate', async (req, res, next) => {
  let { code } = req.body
  const resInvalid = () => res.status(403).send(constants.ACTIVATE_CODE_INVALID)
  if (!utils.isStr(code)) return resInvalid()
  const isValid = user => {
    let nowDate = new Date()
    let startDate = user.activateInfo.date || user.createdDate
    return nowDate - startDate < 24 * 60 * 60000
  }
  try {
    let user = await User.findOne({ 'activateInfo.code': code })
    if (!(user && isValid(user))) return resInvalid()
    user.isActivated = true
    user.activateInfo = { date: new Date() }
    await user.save()
    res.json({ info: constants.ACTIVATE_SUCCESS })
  } catch (err) {
    next(err)
  }
})

/**
 * 用户登录
 */
router.post('/login', (req, res, next) => {
  let { email, password, captcha } = req.body
  let validResult = validator.validEmail(email) ||
    validator.validPwd(password) ||
    validator.validCaptcha(captcha, req)
  delete req.session.captcha
  if (validResult) return res.status(403).send(validResult)
  password = crypto.createHash('md5').update(password).digest('hex')
  User.findOne({ email: email.trim(), password }).select('-__v -password').then(user => {
    if (user) {
      req.session.user = user
      if (user.isActivated) {
        res.json({ info: constants.LOGIN_SUCCESS })
      } else {
        res.json({ code: 401, info: constants.NO_ACTIVATE })
      }
    } else {
      res.status(403).send(constants.EMAIL_OR_PWD_ERROR)
    }
  }).catch(next)
})

/**
 * 发送激活邮件
 */
router.post('/send_activate_mail', (req, res, next) => {
  let { email } = req.body
  let { user } = req.session
  let emailValidResult = validator.validEmail(email)
  if (emailValidResult) {
    return res.status(403).send(emailValidResult)
  }
  if (!user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
  mailUtils.sendActivateMail(req, email).then(code =>
    User.findOneAndUpdate(
      { _id: user._id },
      { $set: { 'activateInfo.code': code, 'activateInfo.date': new Date() } },
    )
  ).then(() => res.json({ info: constants.ACTIVATE_EMAIL_SEND_SUCCESS })).catch(next)
})

/**
 * 重置密码
 */
router.post('/reset_pwd', async (req, res, next) => {
  let { email, captcha, password } = req.body
  let validResult = validator.validEmail(email) || validator.validPwd(password)
  if (validResult) return res.status(403).send(validResult)
  if (!(utils.isStr(captcha) && captcha.trim())) {
    return res.status(403).send(constants.CAPTCHA_ERROR)
  }
  email = email.trim()
  const isValid = doc => {
    let now = new Date()
    return (now - doc.createdDate < 30 * 60000) && doc.captcha === captcha
  }
  try {
    let doc = await VerifCode.findOne({ email })
    if (!(doc && isValid(doc))) return res.status(403).send(constants.CAPTCHA_ERROR)
    password = crypto.createHash('md5').update(password).digest('hex')
    await User.updateOne({ email }, { password })
    delete req.session.user
    res.json({ info: constants.PWD_RESET_SUCCESS })
  } catch (err) {
    next(err)
  }
})

/**
 * 发送邮箱验证码
 */
router.post('/email_captcha', async (req, res, next) => {
  let { email } = req.body
  let validResult = validator.validEmail(email)
  if (validResult) return res.status(403).send(constants.EMAIL_ERROR)
  email = email.trim()
  try {
    let user = await User.findOne({ email })
    if (!user) return res.status(403).send(constants.USER_NOT_FOUND)
    let captcha = (1000 + Math.floor(Math.random() * 9000)).toString()
    await mailUtils.sendMail(email, constants.USER_PWD_RESET_SUBJECT, `您的验证码是：<b>${captcha}</b>`)
    await VerifCode.findOneAndUpdate(
      { email }, 
      { captcha, createdDate: new Date() } ,
      { upsert: true },
    )
    res.json({ info: constants.EMAIL_CAPTCHA_SEND_SUCCESS })
  } catch (err) {
    next(err)
  }
})

/**
 * 用户退出
 */
router.post('/logout', (req, res) => {
  if (req.session.user) {
    delete req.session.user
    res.json({ info: constants.USER_EXIT_SUCCESS })
  } else {
    res.status(401).send(constants.NO_USER_SESSION)
  }
})

/**
 * 获取用户信息
 */
router.get('/info', (req, res) => {
  let { user } = req.session
  if (user) {
    res.json({ info: constants.GET_SUCCESS, data: user })
  } else {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
})

module.exports = router