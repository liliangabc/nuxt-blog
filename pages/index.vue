<template>
  <v-container class="page-index" grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg3 v-for="item in data" :key="item._id">
        <v-card class="article-card" :height="cardHeight" hover nuxt :to="`/article/${item._id}`">
          <v-img :src="item.poster" aspect-ratio="2"></v-img>
          <v-card-title>
            <h3 class="title mb-3 artcile-title">{{item.title}}</h3>
            <div>{{item.summary}}</div>
          </v-card-title>
          <v-card-actions class="actionbar">
            <v-btn icon @click.prevent="toggleCollect(item)">
              <v-icon :color="favColor(item)" dark>favorite</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon color="grey darken-2" dark>share</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  asyncData({ $axios }) {
    return $axios.get('/article/all_list').then(data => {
      return { data: data.data, total: data.total }
    }).catch(err => {})
  },
  data() {
    return {
      data: [],
      total: 0
    }
  },
  computed: {
    cardHeight() {
      return ({ xs: 'auto', sm: 400 })[this.$vuetify.breakpoint.name] || 390
    }
  },
  methods: {
    toggleCollect(item) {
      let curIndex = this.data.indexOf(item)
      this.$axios.post('/article/toggle_collect', { id: item._id }).then(data => {
        item.isFav = !item.isFav
        this.data = [...this.data]
      })
    },
    favColor(item) {
      return item.isFav ? 'red' : 'grey darken-2'
    }
  }
}
</script>
<style lang="less">
.page-index {
  .article-card {
    padding-bottom: 52px;
  }
  .artcile-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .actionbar {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>