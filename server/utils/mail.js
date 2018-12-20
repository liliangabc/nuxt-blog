/**
 * 邮件工具模块
 */

const crypto = require('crypto')
const nodemailer = require('nodemailer')
const config = require('./config')
const constants = require('./constants')

const transporter = nodemailer.createTransport({
  host: 'smtp.live.com',
  auth: {
    user: config.APP_EMAIL_USER,
    pass: config.APP_EMAIL_PWD
  }
})

let sender = `"liliang" <${config.APP_EMAIL_USER}>`

module.exports = {
  /**
   * 发送邮件
   * @param {String} to 
   * @param {String} subject 
   * @param {String} html 
   */
  sendMail(to, subject, html) {
    return transporter.sendMail({
      from: sender, to, subject, html
    })
  },

  /**
   * 获取激活邮件模板
   * @param {Object} data 
   */
  getActivateHtml(data = {}) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <style>.footer { font-size: 12px; color: #999; }</style>
        </head>
        <body>
          <div>
            <p>亲爱的<a href="mailto:${data.email}">${data.email}</a>：</p>
            <p>我们已经收到您的帐号激活申请，请点击以下链接激活您的帐号：</p>
            <a href="${data.url}">${data.url}</a>
            <p>如果该链接无法点击，请直接拷贝以上链接到浏览器(例如chrome)地址栏中访问</p>
            <p class="footer">此信是由 <a href="${data.site}">SOC-SOC</a> 系统发出，系统不接收回信，请勿直接回复。</p>
          </div>
        </body>
      </html>
    `
  },

  /**
   * 发送激活邮件
   * @param {Request} req 
   * @param {String} email 
   */
  sendActivateMail(req, email) {
    let site = `${req.protocol}://${req.headers.host}`
    let code = crypto.createHash('sha256').update(Math.random().toString()).digest('hex')
    let url = `${site}/entry/activate?code=${code}`
    let html = this.getActivateHtml({ site, email, url })
    return this.sendMail(email, constants.USER_ACTIVATE_SUBJECT, html).then(() => code)
  }
}