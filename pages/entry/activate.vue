<template>
<div class="page-entry-activate">
  <h3 class="title font-weight-bold">{{type === 'error' ? '激活失败' : '欢迎你的加入'}}</h3>
  <v-alert :type="type" class="my-4" :value="true">{{message}}</v-alert>
  <v-layout justify-center>
    <v-btn nuxt to="/entry/login" flat class="ml-0" color="primary">
      <v-icon>arrow_back</v-icon>
      我要登录
    </v-btn>
    <v-btn nuxt to="/" flat color="primary">
      <v-icon>home</v-icon>
      进入首页
    </v-btn>
  </v-layout>
</div>
</template>
<script>
export default {
  asyncData({ $axios, route }) {
    return $axios.post('/user/activate', {
      code: route.query.code
    }).then(data => {
      return { type: 'success', message: data.info }
    }).catch(err => {
      return { type: 'error', message: err.message }
    })
  }
}
</script>