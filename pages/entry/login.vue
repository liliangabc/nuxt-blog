<template>
<div>
  <v-form ref="form">
    <v-text-field prepend-icon="email" label="邮 箱" type="email" :rules="rules.email" required v-model.trim="formData.email"></v-text-field>
    <v-text-field prepend-icon="lock" label="密 码" type="password" :rules="rules.password" required v-model.trim="formData.password"></v-text-field>
    <v-layout class="captcha-wrapper">
      <v-text-field prepend-icon="verified_user" label="验证码" :rules="rules.captcha" required v-model="formData.captcha"></v-text-field>
      <img class="pic-captcha" ref="captcha" title="点击刷新" @click="updateCaptcha">
    </v-layout>
    <v-layout justify-center my-3>
      <v-btn color="primary" :loading="loading" @click="handleSubmit">登 录</v-btn>
    </v-layout>
    <v-layout justify-end>
      <nuxt-link to="resetpwd">忘记密码?</nuxt-link>
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
      let { commit } = this.$store
      this.$axios.post('user/login', this.formData).then(data => {
        if (data.code === 401) {
          this.loading = false
          alert(data.info)
        } else {
          location.href = '/'
        }
      }).catch(err => {
        this.formData.captcha = ''
        this.updateCaptcha()
        this.loading = false
        alert(err.message)
      })
    }
  },
  mounted() {
    this.updateCaptcha()
  }
}
</script>