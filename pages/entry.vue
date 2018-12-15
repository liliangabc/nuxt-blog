<template>
  <div class="elevation-1 page-user-entry">
    <h3 class="title" v-if="isResetPage">用邮箱重置你的密码</h3>
    <div class="tabs" v-else>
      <nuxt-link to="login">登录</nuxt-link>
      <b class="dot"></b>
      <nuxt-link to="register">注册</nuxt-link>
    </div>
    <nuxt/>
  </div>
</template>
<script>
// http://localhost:3000/api/user/activate?code=9890c1f9bbacb7b1f2efc7a121c92e3648589e93bd171b5b062b9fc42ef7705f
export default {
  layout: 'entry',
  computed: {
    isResetPage() {
      return this.$route.name === 'entry-resetpwd'
    }
  }
}
</script>
<style lang="less">
.page-user-entry {
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;
  .title {
    text-align: center;
    margin-bottom: 24px;
    color: #303133;
    font-size: 20px;
  }
  .tabs {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      color: #303133;
      font-size: 18px;
      text-decoration: none;
      &.nuxt-link-active, &:hover {
        color: #1565c0;
      }
    }
    .dot {
      width: 4px;
      height: 4px;
      background-color: #606266;
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