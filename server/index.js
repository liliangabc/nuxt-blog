
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const mongoose = require('mongoose')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const { APP_SESSION_SECRET } = require('./utils/config')

require('./models/conndb').connDB()

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.disable('x-powered-by')
app.set('port', port)
app.use(compression())
app.use(express.json())
app.use(express.urlencoded())
app.use(session({
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  secret: APP_SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
require('./routes')(app)

let config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  const nuxt = new Nuxt(config)
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use(nuxt.render)
  app.use((req, res, next) => res.sendStatus(404))
  app.use((err, req, res, next) => {
    if (config.dev) console.log(err.message)
    res.sendStatus(500)
  })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()