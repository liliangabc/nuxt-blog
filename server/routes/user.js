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
router.post('/register', (req, res) => {
  // 获取并验证数据
  let { userName, email, password, captcha } = req.body
  let validResult = validator.validUserName(userName) ||
    validator.validEmail(email) ||
    validator.validPwd(password) ||
    validator.validCaptcha(captcha, req)
  delete req.session.captcha
  if (validResult) return res.status(403).send(validResult)

  // 检查用户名或者邮箱是否已被使用
  email = email.trim()
  userName = userName.trim()
  User.findOne().or([{ userName }, { email }]).exec((err, user) => {
    if (err) {
      res.status(500).send(constants.DB_ERROR)
    } else if (user) {
      if (user.userName === userName) {
        res.status(403).send(constants.USER_USED)
      } else {
        res.status(403).send(constants.EMAIL_USED)
      }

    // 如果用户名和邮箱可用
    } else {
      mailUtils.sendActivateMail(req, email).then(code => {
        // 保存用户信息到数据库
        password = crypto.createHash('md5').update(password).digest('hex')
        new User({ userName, password, email, activateInfo: { code } }).save(err => {
          if (err) {
            res.status(500).send(constants.DB_ERROR)
          } else {
            res.json({ info: constants.REGISTER_SUCCESS })
          }
        })
      }).catch(() => res.status(500).send(constants.SMTP_ERROR))
    }
  })
})

/**
 * 用户激活
 */
router.post('/activate', (req, res) => {
  // 获取并验证数据
  let { code } = req.body
  if (!utils.isStr(code)) {
    return res.status(403).send(constants.ACTIVATE_CODE_INVALID)
  }

  // 检查激活码是否有效
  const isValid = user => {
    let nowDate = new Date()
    let startDate = user.activateInfo.date || user.createdDate
    return nowDate - startDate < 24 * 60 * 60000
  }

  // 更新用户激活状态
  User.findOne({ 'activateInfo.code': code }, (err, user) => {
    if (err) return res.status(500).send(constants.DB_ERROR)
    if (user && isValid(user)) {
      user.isActivated = true
      user.activateInfo = { date: new Date() }
      user.save(err => {
        if (err) {
          return res.status(500).send(constants.DB_ERROR)
        }
        res.json({ info: constants.ACTIVATE_SUCCESS })
      })
    } else {
      res.status(403).send(constants.ACTIVATE_CODE_INVALID)
    }
  })
})

/**
 * 用户登录
 */
router.post('/login', (req, res) => {
  // 获取数据并验证
  let { email, password, captcha } = req.body
  let validResult = validator.validEmail(email) || 
    validator.validPwd(password) || 
    validator.validCaptcha(captcha, req)
  delete req.session.captcha
  if (validResult) return res.status(403).send(validResult)

  // 查找用户是否存在
  let pwd = crypto.createHash('md5').update(password).digest('hex')
  User.findOne({ email: email.trim() }, { __v: 0 }, (err, user) => {
    if (err) {
      res.status(500).send(constants.DB_ERROR)
    // 如果用户存在且密码正确，那么检查用户是否已激活
    } else if (user && user.password === pwd) {
      let { password: _pwd, ...data } = JSON.parse(JSON.stringify(user))
      req.session.user = data
      // 如果已经激活，那么登录成功
      if (user.isActivated) {
        res.json({ info: constants.LOGIN_SUCCESS })
      } else {
        res.json({ code: 401, info: constants.NO_ACTIVATE })
      }
    } else {
      res.status(403).send(constants.EMAIL_OR_PWD_ERROR)
    }
  })
})

/**
 * 发送激活邮件
 */
router.post('/send_activate_mail', (req, res) => {
  // 获取数据并验证
  let { email } = req.body
  let { user } = req.session
  let emailValidResult = validator.validEmail(email)
  if (emailValidResult) {
    return res.status(403).send(emailValidResult)
  }
  if (!user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }

  // 发送邮件并更新用户激活信息
  mailUtils.sendActivateMail(req, email).then(code => {
    User.findByIdAndUpdate(
      user._id,
      { $set: { 'activateInfo.code': code, 'activateInfo.date': new Date() } },
      err => {
        if (err) {
          res.status(500).send(constants.DB_ERROR)
        } else {
          res.json({ info: constants.ACTIVATE_EMAIL_SEND_SUCCESS })
        }
      }
    )
  }).catch(() => res.status(500).send(constants.SMTP_ERROR))
})

/**
 * 重置密码
 */
router.post('/reset_pwd', (req, res) => {
  // 获取数据并验证
  let { email, captcha, password } = req.body
  let validResult = validator.validEmail(email) || validator.validPwd(password)
  if (validResult) {
    return res.status(403).send(validResult)
  }
  if (!(utils.isStr(captcha) && captcha.trim())) {
    return res.status(403).send(constants.CAPTCHA_ERROR)
  }

  email = email.trim()
  const isValid = doc => {
    let now = new Date()
    return (now - doc.createdDate < 30 * 60000) && doc.captcha === captcha
  }

  // 检查验证码是否有效
  VerifCode.findOne({ email }, (err, doc) => {
    if (err) {
      res.status(500).send(constants.DB_ERROR)
    } else if (doc) {
      if (isValid(doc)) {
        // 更新用户密码
        password = crypto.createHash('md5').update(password).digest('hex')
        User.updateOne({ email }, { password }, (err, raw) => {
          if (err) {
            res.status(500).send(constants.DB_ERROR)
          } else {
            res.json({ info: constants.PWD_RESET_SUCCESS })
          }
        })
      } else {
        res.status(403).send(constants.CAPTCHA_ERROR)
      }
    } else {
      res.status(403).send(constants.USER_NOT_FOUND)
    }
  })
})

/**
 * 发送邮箱验证码
 */
router.post('/email_captcha', (req, res) => {
  // 获取数据并验证
  let { email } = req.body
  let validResult = validator.validEmail(email)
  if (validResult) {
    return res.status(403).send(constants.EMAIL_ERROR)
  }

  email = email.trim()

  // 查找用户
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).send(constants.DB_ERROR)
    } else if (user) {
      // 发送验证码
      let captcha = (1000 + Math.floor(Math.random() * 9000)).toString()
      mailUtils.sendMail(
        email, 
        constants.USER_PWD_RESET_SUBJECT, 
        `您的验证码是：<b>${captcha}</b>`
      ).then(() => {
        // 保存或更新验证码
        VerifCode.findOneAndUpdate(
          { email }, 
          { captcha, createdDate: new Date() } ,
          { upsert: true },
          (err, doc) => {
            if (err) {
              res.status(500).send(constants.DB_ERROR)
            } else {
              res.json({ info: constants.EMAIL_CAPTCHA_SEND_SUCCESS })
            }
          }
        )
      }).catch(() => res.status(500).send(constants.SMTP_ERROR))
    } else {
      res.status(403).send(constants.USER_NOT_FOUND)
    }
  })
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