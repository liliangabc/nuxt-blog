<template>
<v-form>
  <v-text-field prepend-icon="person" label="用户名" hint="请输入你的昵称" v-model.trim="formData.userName"></v-text-field>
  <v-text-field prepend-icon="email" label="邮箱" type="email" v-model.trim="formData.email"></v-text-field>
  <v-text-field prepend-icon="lock" label="密 码" type="password" v-model.trim="formData.password"></v-text-field>
  <v-text-field prepend-icon="lock" label="确认密码" type="password" v-model.trim="formData.confirmPwd"></v-text-field>
  <v-layout justify-center>
    <v-btn color="primary">注 册</v-btn>
  </v-layout>
</v-form>
</template>
<script>
export default {
  data() {
    return {
      formData: {}
    }
  }
}
</script>