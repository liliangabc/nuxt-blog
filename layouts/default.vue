<template>
<v-app>
  <!-- 顶部工具栏 -->
  <v-toolbar color="blue darken-3" dark app fixed :clipped-left="$vuetify.breakpoint.lgAndUp">
    <v-toolbar-title style="width: 300px;" class="ml-0 pl-3">
      <span class="hidden-sm-and-down">Nuxt Blog</span>
    </v-toolbar-title>
    <v-text-field class="hidden-sm-and-down" prepend-inner-icon="search"
      label="Search" flat solo-inverted hide-details></v-text-field>
    <v-spacer></v-spacer>
    <v-btn flat nuxt to="/entry/login">登录</v-btn>
  </v-toolbar>
  <!-- 内容区 -->
  <v-content>
    <nuxt/>
  </v-content>
</v-app>
</template>
<script>
export default {
  data() {
    return {
      drawer: false
    }
  }
}
</script>