<template>
<v-card>
  <h3 class="body-2 py-2 px-3">赞助商</h3>
  <v-divider></v-divider>
  <v-layout style="height: 120px;" align-center justify-center>
    <p class="red--text title">广告位火热招租中</p>
  </v-layout>
</v-card>
</template>
<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>