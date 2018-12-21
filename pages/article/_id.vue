<template>
<v-layout class="px-3 py-4 page-article">
  <h1 v-if="errmsg">{{errmsg}}</h1>
  <template v-else>
    <div class="content-wrapper">
      <com-article-details v-if="data" :article="data"></com-article-details>
    </div>
    <aside class="right-sidebar">

    </aside>
  </template>
</v-layout>
</template>
<script>
import ComArticleDetails from '~/components/ArticleDetails'
export default {
  components: { ComArticleDetails },
  asyncData({ $axios, route, redirect }) {
    return $axios.get('/article', {
      params: { id: route.params.id  }
    }).then(data => data).catch(err => ({ errmsg: err.message }))
  }
}
</script>
<style lang="less">
.page-article {
  max-width: 960px;
  margin: auto;
  .content-wrapper {
    background-color: #fff;
    flex: 1;
  }
  .right-sidebar {
    width: 240px;
    min-width: 240px;
  }
}
</style>