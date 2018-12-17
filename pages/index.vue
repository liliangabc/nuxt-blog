<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs6 v-for="item in data" :key="item._id">
        <v-card height="480">
          <v-img :src="item.poster" aspect-ratio="2.75"></v-img>
          <v-card-title>
            <div>
              <h3 class="headline mb-0">{{item.title}}</h3>
              <div>{{item.content}}</div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn icon>
              <v-icon>star</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>favorite</v-icon>
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
    }).catch(err => { data: [] })
  }
}
</script>