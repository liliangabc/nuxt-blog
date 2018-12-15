<template>
  <v-card class="px-4 py-4 page-user-entry">
    <v-layout class="mb-4 titlebar" justify-center align-center v-if="!isActivatePage">
      <h3 class="title" v-if="isResetPage">用邮箱重置你的密码</h3>
      <template v-else>
        <nuxt-link class="title" to="login">登录</nuxt-link>
        <b class="dot"></b>
        <nuxt-link class="title" to="register">注册</nuxt-link>
      </template>
    </v-layout>
    <nuxt/>
  </v-card>
</template>
<script>
export default {
  layout: 'entry',
  computed: {
    isResetPage() {
      return this.$route.name === 'entry-resetpwd'
    },
    isActivatePage() {
      return this.$route.name === 'entry-activate'
    }
  }
}
</script>
<style lang="less">
.page-user-entry {
  width: 100%;
  max-width: 400px;
  .title {
    color: #212121;
  }
  .titlebar {
    a {
      text-decoration: none;
      &.nuxt-link-active, &:hover {
        color: #1976d2;
      }
    }
    .dot {
      width: 4px;
      height: 4px;
      background-color: #616161;
      border-radius: 50%;
      margin: 0 12px;
    }
  }
  .captcha-wrapper {
    position: relative;
    .pic-captcha {
      height: 30px;
      cursor: pointer;
      position: absolute;
      top: 16px;
      right: 0;
    }
  }
}
</style>