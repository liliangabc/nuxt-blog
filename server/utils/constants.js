/**
 * 常量定义模块
 */

const ACTIVATE_EMAIL_SEND_SUCCESS = '激活链接已发送至您的邮箱，请在24小时内激活；如果收件箱中没有找到，那么请检查垃圾箱。'

module.exports = {
  // 用户
  USER_NAME_ERROR: '请输入2-15位用户名',
  USER_PWD_ERROR: '请输入6-18位密码',
  USER_USED: '该用户名已被使用',
  USER_NOT_FOUND: '用户不存在',
  USER_ACTIVATE_SUBJECT: '用户账号激活',
  USER_PWD_RESET_SUBJECT: '用户密码重置',
  USER_EXIT_SUCCESS: '退出成功',
  NO_USER_SESSION: '用户会话不存在',

  // 邮箱
  EMAIL_ERROR: '请输入正确的邮箱地址',
  EMAIL_USED: '该邮箱已被使用',
  EMAIL_OR_PWD_ERROR: '邮箱或密码错误',
  EMAIL_CAPTCHA_SEND_SUCCESS: '验证码已发送到您的邮箱，24小时内有效，请查收邮件',

  // 激活
  ACTIVATE_EMAIL_SEND_SUCCESS,
  ACTIVATE_SUCCESS: '恭喜你！激活成功',
  ACTIVATE_CODE_INVALID: '激活码无效或已过期',
  NO_ACTIVATE: '很抱歉！你的账号没有通过邮箱激活，必须激活后才可使用；点击激活，系统将发送一封电子邮件到你的登录邮箱，请注意查收。',

  // 其它
  CAPTCHA_ERROR: '验证码错误',
  DB_ERROR: '数据库错误',
  REGISTER_SUCCESS: `恭喜你！注册成功，${ACTIVATE_EMAIL_SEND_SUCCESS}`,
  LOGIN_SUCCESS: '登录成功',
  PWD_RESET_SUCCESS: '密码重置成功',
  SMTP_ERROR: '邮件服务器连接错误',
  SERVER_ERROR: '服务器内部错误',
  GET_SUCCESS: '获取成功',
  POST_SUCCESS: '提交成功',
  DEL_SUCCESS: '删除成功'
}