<template>
<v-layout class="layout-error" align-center justify-center fill-height>
  <div class="text-md-center">
    <h1 class="display-4 red--text status-code">{{statusCode}}</h1>
    <p class="title grey--text text--darken-3 my-4">{{message}}</p>
    <v-btn color="primary">去首页看看</v-btn>
  </div>
</v-layout>
</template>
<script>
export default {
  props: {
    error: Object
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message || `<%= messages.client_error %>`
    }
  }
}
</script>
<style lang="less">
.layout-error {
  .status-code {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif !important;
  }
}
</style>