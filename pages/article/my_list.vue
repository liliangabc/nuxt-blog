<template>
  <com-article-list :list.sync="list"></com-article-list>
</template>
<script>
export default {
  asyncData({ $axios }) {
    return $axios.get('/article/list').then(data => {
      return { list: data.data, total: data.total }
    }).catch(err => {
      return { list: [] }
    })
  }
}
</script>