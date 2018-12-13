const mongoose = require('mongoose')
const config = require('../utils/config')

exports.connDB = () => {
  let options = {
    useNewUrlParser: true ,
    server: { socketOptions: { keepAlive: 1 }}
  }
  mongoose.connect(config.DB_URL, options)
  mongoose.connection.on('open', err => {
    if (err) console.error(err)
    console.log('数据库连接成功！')
  })
}