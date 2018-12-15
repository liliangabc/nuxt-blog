<template>
<v-app>
  <!-- 顶部工具栏 -->
  <v-toolbar color="primary" dark app fixed :clipped-left="$vuetify.breakpoint.lgAndUp">
    <v-toolbar-title style="width: 300px;" class="ml-0 pl-3">
      <span class="hidden-sm-and-down">Nuxt Blog</span>
    </v-toolbar-title>
    <v-text-field class="hidden-sm-and-down" prepend-inner-icon="search"
      label="Search" flat solo-inverted hide-details></v-text-field>
    <v-spacer></v-spacer>
    <v-btn flat>写文章</v-btn>
    <v-btn icon v-if="isLogined">
      <v-icon>person</v-icon>
    </v-btn>
    <v-btn v-else flat nuxt to="/entry/login">登录</v-btn>
  </v-toolbar>
  <!-- 内容区 -->
  <v-content>
    <nuxt/>
  </v-content>
</v-app>
</template>
<script>
export default {
  computed: {
    user() {
      return this.$store.state.user
    },
    isLogined() {
      return !!this.user._id
    }
  }
}
</script>