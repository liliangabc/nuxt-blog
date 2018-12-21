<template>
<div class="px-3 py-4 elevation-1 com-article-details">
  <v-layout align-center>
    <nuxt-link to="/">
      <v-avatar v-if="article.user.avator" size="48">
        <img :src="article.user.avator" alt="avatar">
      </v-avatar>
      <v-icon v-else size="48">account_circle</v-icon>
    </nuxt-link>
    <div class="ml-2">
      <nuxt-link class="grey--text text--darken-4 font-weight-bold subheading" to="/">{{article.user.userName}}</nuxt-link>
      <v-layout class="grey--text text--darken-1 meta-info" align-center>
        <span>{{article.meta.createAt | toLocalDate}} 阅读 {{article.viewCount}}</span>
        <template v-if="isMine" align-center>
          <span class="mx-2 grey darken-1 dot"></span>
          <nuxt-link class="link-edit" to="/">编辑</nuxt-link>
        </template>
        <span></span>
      </v-layout>
    </div>
  </v-layout>
  <h1 class="my-4 headline">{{article.title}}</h1>
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
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    isMine() {
      return this.user && this.user._id === this.article.user._id
    }
  },
  filters: {
    toLocalDate(dateStr) {
      return new Date(dateStr).toLocaleDateString()
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
  .meta-info {
    font-size: 13px;
    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
    }
    .link-edit:hover {
      text-decoration: underline;
    }
  }
}
</style>