<template>
<div class="py-4 px-3 page-article">
  <v-card>
    <v-card-title class="article-title" primary-title>
      <div>
        <h3 class="headline mb-2">{{data.title}}</h3>
        <div class="article-info grey--text text--darken-2">
          <span class="caption mr-3">作者：{{data.user.userName}}</span>
          <span class="caption mr-3">创建时间：{{data.meta.createAt | toLocalDate}}</span>
          <span class="caption">最后更新于：{{data.meta.updateAt | toLocalDate}}</span>
        </div>
      </div>
    </v-card-title>
    <v-img :src="data.poster" aspect-ratio="2.75"></v-img>
    <v-card-text v-html="data.content"></v-card-text>
  </v-card>
</div>
</template>
<script>
export default {
  asyncData({ $axios, route }) {
    return $axios.get('/article', {
      params: { id: route.params.id  }
    }).then(({ data }) => {
      return { data }
    }).catch(err => ({ data: {} }))
  },
  filters: {
    toLocalDate(dateStr) {
      return new Date(dateStr).toLocaleString()
    }
  }
}
</script>
<style lang="less">
.page-article {
  max-width: 800px;
  margin: auto;
  .article-title {
    justify-content: center;
    text-align: center;
  }
}
</style>