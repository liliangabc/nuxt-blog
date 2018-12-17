
const constants = require('../utils/constants')

exports.checkAuth = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.status(401).send(constants.NO_USER_SESSION)
  }
}