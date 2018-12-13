/**
 * 数据验证模块
 */

const utils = require('./index')
const constants = require('./constants')

module.exports = {
  /**
   * 验证用户名
   * @param {String} userName 
   */
  validUserName(userName) {
    let strlen = utils.isStr(userName) ? userName.trim().length : 0
    return (strlen < 2 || strlen > 15) && constants.USER_NAME_ERROR
  },

  /**
   * 验证密码
   * @param {String} pwd 
   */
  validPwd(pwd) {
    let strlen = utils.isStr(pwd) ? pwd.length : 0
    return (strlen < 6 || strlen > 18) && constants.USER_PWD_ERROR
  },

  /**
   * 验证邮箱
   * @param {String} email 
   */
  validEmail(email) {
    return !utils.isEmail(email) && constants.EMAIL_ERROR
  },

  /**
   * 验证验证码
   * @param {String} captcha 
   * @param {Request} req 
   */
  validCaptcha(captcha, req) {
    return (!utils.isStr(captcha) || captcha.toLowerCase() !== req.session.captcha) && constants.CAPTCHA_ERROR
  }
}