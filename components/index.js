import ArticleList from './ArticleList'

const coms = [
  ArticleList
]

export default {
  install(Vue) {
    coms.forEach(_ => Vue.component(_.name, _))
  }
}