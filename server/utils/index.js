/**
 * 工具模块
 */

const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
  isStr(str) {
    return typeof str === 'string'
  },
  isFunc(func) {
    return typeof func === 'function'
  },
  isNum(num) {
    return typeof num === 'number'
  },
  isEmail(str) {
    return this.isStr(str) && regEmail.test(str)
  },
  isEmpty(str) {
    return !(this.isStr(str) && str.trim())
  }
}