/**
 * 七牛对象存储路由模块
 */

const express = require('express')
const qiniu = require('qiniu')
const config = require('../utils/config')
const constants = require('../utils/constants')

const getToken = () => {
  let accessKey = config.APP_QINIU_AK
  let secretKey = config.APP_QINIU_SK
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  let options = { scope: 'blog' }
  let putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}

const dlURL = 'http://pjtqenm4q.bkt.clouddn.com'

const router = express.Router()

/**
 * 获取上传token
 */
router.get('/get_token', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send(constants.NO_USER_SESSION)
  }
  return res.json({
    info: constants.GET_SUCCESS,
    data: {
      dlURL,
      token: getToken(),
      host: qiniu.zone.Zone_z0.srcUpHosts[0]
    }
  })
})

module.exports = router