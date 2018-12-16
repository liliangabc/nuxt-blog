let {
  APP_DB_URL = 'mongodb://127.0.0.1:27017/blogdb',
  APP_SESSION_SECRET = 'test2018',
  APP_EMAIL_USER = 'jserli@outlook.com',
  APP_EMAIL_PWD = '',
  APP_QINIU_AK = '',
  APP_QINIU_SK = ''
} = process.env

module.exports = {
  APP_DB_URL,
  APP_SESSION_SECRET,
  APP_EMAIL_USER,
  APP_EMAIL_PWD,
  APP_QINIU_AK,
  APP_QINIU_SK
}