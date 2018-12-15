<template>
<div>
  <v-form ref="form">
    <v-text-field prepend-icon="email" label="邮 箱" type="email" :rules="rules.email" required v-model.trim="formData.email"></v-text-field>
    <v-layout class="captcha-wrapper">
      <v-text-field prepend-icon="verified_user" label="验证码" :rules="rules.captcha" required v-model="formData.captcha"></v-text-field>
      <v-btn depressed style="margin-right: 0;" color="info" @click="sendCaptcha">发送验证码</v-btn>
    </v-layout>
    <v-text-field prepend-icon="lock" label="新密码" type="password" :rules="rules.password" required v-model.trim="formData.password"></v-text-field>
    <v-text-field prepend-icon="lock" label="确认密码" type="password" :rules="rules.confirmPwd" required v-model.trim="formData.confirmPwd"></v-text-field>
    <v-layout justify-center my-3>
      <v-btn color="info" :loading="loading" @click="handleSubmit">重置密码</v-btn>
    </v-layout>
    <v-layout>
      <v-icon color="primary">arrow_back</v-icon>
      <nuxt-link to="login">返回登录注册</nuxt-link>
    </v-layout>
  </v-form>
</div>
</template>
<script>
import serverUtils from '~/server/utils'
export default {
  data() {
    return {
      formData: {},
      rules: {
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
    sendCaptcha() {
      
    },
    handleSubmit() {
      if (!this.$refs.form.validate()) return
      this.loading = true
      this.$axios.post('user/reset_pwd', this.formData).then(data => {
        this.$router.push('login')
      }).catch(err => {
        this.formData.captcha = ''
        this.updateCaptcha()
        this.loading = false
      })
    }
  }
}
</script>