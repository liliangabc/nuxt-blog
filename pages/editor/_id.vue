<template>
<mavon-editor class="page-editor" ref="editor" 
  :boxShadow="false" :toolbarsFlag="true" :toolbars="MEOptions.toolbars"></mavon-editor>
</template>
<script>
export default {
  layout: 'editor',
  data() {
    return {
      MEOptions: {}
    }
  },
  mounted() {
    const { editor } = this.$refs
    editor.s_fullScreen = true
    this.MEOptions = {
      toolbars: {
        ...editor.toolbars,
        ...{
          fullscreen: false,
          subfield: false,
          preview: false,
          navigation: false,
          readmodel: false,
          save: false
        }
      }
    }
  }
}
</script>
<style lang="less">
.page-editor {
  width: 100%;
  height: 100%;
}
</style>