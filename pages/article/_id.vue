<template>
<v-layout class="px-3 py-4 page-article">
  <div class="content-wrapper">
    <com-article-details :article="data"></com-article-details>
  </div>
  <aside class="ml-4 right-sidebar">
    <com-ad-box></com-ad-box>
  </aside>
</v-layout>
</template>
<script>
import ComAdBox from '~/components/AdBox'
import ComArticleDetails from '~/components/ArticleDetails'
export default {
  components: { ComArticleDetails, ComAdBox },
  asyncData({ $axios, route, error }) {
    return $axios.get(`/article?id=${route.params.id}`).then(data => {
      return data.code ? error({ statusCode: 404, message: data.info }) : data
    }).catch(error)
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