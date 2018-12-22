const _require = name => require(`./${name}`).default

const coms = [
  _require('ArticleList'),
  _require('AuthorInfoBox')
]

export default {
  install(Vue) {
    coms.forEach(_ => Vue.component(_.name, _))
  }
}