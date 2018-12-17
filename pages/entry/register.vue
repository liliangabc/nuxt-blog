<template>
<div>
  <v-form ref="form">
    <v-text-field prepend-icon="person" label="用户名" :rules="rules.userName" required v-model.trim="formData.userName"></v-text-field>
    <v-text-field prepend-icon="email" label="邮 箱" type="email" :rules="rules.email" required v-model.trim="formData.email"></v-text-field>
    <v-text-field prepend-icon="lock" label="密 码" type="password" :rules="rules.password" required v-model.trim="formData.password"></v-text-field>
    <v-text-field prepend-icon="lock" label="确认密码" type="password" :rules="rules.confirmPwd" required v-model.trim="formData.confirmPwd"></v-text-field>
    <v-layout class="captcha-wrapper">
      <v-text-field prepend-icon="verified_user" label="验证码" :rules="rules.captcha" required v-model="formData.captcha"></v-text-field>
      <img class="pic-captcha" ref="captcha" title="点击刷新" @click="updateCaptcha">
    </v-layout>
    <v-layout justify-center mt-3>
      <v-btn color="primary" :loading="loading" @click="handleSubmit">注 册</v-btn>
    </v-layout>
  </v-form>
</div>
</template>
<script>
const serverUtils = require('~/server/utils')
export default {
  data() {
    return {
      formData: {},
      rules: {
        userName: [
          v => !!v || '请输入你的昵称',
          v => (v && v.length > 1 && v.length < 16) ||  '用户名必须为2-15个字符'
        ],
        email: [
          v => !!v || '请输入你的邮箱',
          v => serverUtils.isEmail(v) || '请输入正确的邮箱地址'
        ],
        password: [
          v => !!v || '请输入你的密码',
          v => (v && v.length > 5 && v.length < 19) || '密码必须为6-18个字符'
        ],
        confirmPwd: [
          v => !!v || '请输入确认密码',
          v => (v === this.formData.password) || '两次输入的密码不一致'
        ],
        captcha: [
          v => !!v || '请输入验证码'
        ]
      },
      loading: false
    }
  },
  methods: {
    updateCaptcha() {
      this.$refs.captcha.src = `/api/captcha?t=${Date.now()}`
    },
    handleSubmit() {
      if (!this.$refs.form.validate()) return
      this.loading = true
      this.$axios.post('user/register', this.formData).then(data => {
        this.$router.push('login')
      }).catch(err => {
        this.formData.captcha = ''
        this.updateCaptcha()
        this.loading = false
      })
    }
  },
  mounted() {
    this.updateCaptcha()
  }
}
</script>