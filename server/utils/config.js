let { DB_URL, SESSION_SECRET, EMAIL_USER, EMAIL_PWD } = process.env
module.exports = {
  DB_URL: (DB_URL || 'mongodb://127.0.0.1:27017') + '/blogdb',
  sessionSecret: SESSION_SECRET || 'test2018',
  email: {
    user: EMAIL_USER || 'jserli@outlook.com',
    password: EMAIL_PWD || ''
  }
}