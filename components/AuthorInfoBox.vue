<template>
<div class="pa-1 com-author-info-box">
  <nuxt-link to="/">
    <v-avatar class="d-block" v-if="article.user.avator" size="48">
      <img :src="article.user.avator" alt="avatar">
    </v-avatar>
    <v-icon class="d-block" v-else size="48">account_circle</v-icon>
  </nuxt-link>
  <div class="ml-1">
    <nuxt-link class="grey--text text--darken-4 font-weight-bold subheading" to="/">{{article.user.userName}}</nuxt-link>
    <div class="grey--text text--darken-1 meta-info">
      <span>{{article.meta.createAt | toLocalDate}} 阅读 {{article.viewCount}}</span>
      <template v-if="isMine" align-center>
        <span class="mx-2 grey darken-1 dot"></span>
        <nuxt-link class="link-edit" :to="`/editor/${article._id}`">编辑</nuxt-link>
      </template>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'com-author-info-box',
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
.com-author-info-box {
  display: flex;
  align-items: center;
  .meta-info {
    font-size: 13px;
    display: flex;
    align-items: center;
    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      transform: scale(.7);
    }
    .link-edit:hover {
      text-decoration: underline;
    }
  }
}
</style>