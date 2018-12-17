<template>
<v-app>
  <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
    <v-toolbar flat color="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <v-icon>account_circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>
      <v-list-tile v-for="item in items" :key="item.title" nuxt :to="item.to">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <!-- 顶部工具栏 -->
  <v-toolbar color="primary" dark app fixed :clipped-left="$vuetify.breakpoint.lgAndUp">
    <v-toolbar-title style="width: 300px;" class="ml-0 pl-3">
      <v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
      <span class="hidden-sm-and-down">Nuxt Blog</span>
    </v-toolbar-title>
    <v-text-field class="hidden-sm-and-down" prepend-inner-icon="search"
      label="Search" flat solo-inverted hide-details></v-text-field>
    <v-spacer></v-spacer>
    <v-btn flat nuxt to="/editor">写文章</v-btn>
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
  data() {
    return {
      drawer: false,
      items: [
        { title: '首页', icon: 'home', to: '/' },
        { title: '我的收藏', icon: 'favorite', to: '/about' }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    isLogined() {
      return !!this.user._id
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>