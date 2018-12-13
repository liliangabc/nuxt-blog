/**
 * 路由根模块
 */

const userRouter = require('./user')
const postsRouter = require('./posts')

module.exports = app => {
  app.use('/api/user', userRouter)
  app.use('/api/posts', postsRouter)
}