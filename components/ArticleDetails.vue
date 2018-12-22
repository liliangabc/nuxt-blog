<template>
<div class="px-3 py-4 elevation-1 com-article-details">
  <com-author-info-box :article="article"></com-author-info-box>
  <h1 class="my-3 headline font-weight-bold">{{article.title}}</h1>
  <v-img v-if="article.poster" :src="article.poster" aspect-ratio="2.75"></v-img>
  <div class="mt-4 article-content" v-html="article.content"></div>
</div>
</template>
<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="less">
.com-article-details {
  .article-content {
    line-height: 1.8;
    img {
      max-width: 100%;
    }
  }
}
</style>