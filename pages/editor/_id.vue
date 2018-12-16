<template>
<div class="page-editor">
  <!-- <com-help-card></com-help-card> -->
  <div class="editor-wrapper">
    <div class="px-3 titlebar">
      <v-text-field class="block font-weight-bold headline" label="输入文章标题..." hide-details single-line full-width></v-text-field>
      <!-- 上传海报 -->
      <v-menu v-model="posterMenuVisible" :close-on-content-click="false" transition="slide-y-transition" min-width="300" offset-y>
        <v-btn icon slot="activator">
          <v-icon color="grey">add_photo_alternate</v-icon>
        </v-btn>
        <div class="white px-3 py-3">
          <div class="subheading font-weight-bold mb-2 grey--text">添加封面大图</div>
          <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
            <!-- <v-btn style="height: 100%;" class="my-0 btn-add-poster" block depressed>
              点击此处添加图片
            </v-btn> -->
            <v-layout justify-end>
              <v-btn title="移除这张图片" class="mx-0 my-0" icon>
                <v-icon dark>delete_forever</v-icon>
              </v-btn>
            </v-layout>
          </v-img>
        </div>
      </v-menu>
      <!-- 发布 -->
      <v-btn flat color="info">
        <v-icon>publish</v-icon>
        发布文章
      </v-btn>
    </div>
    <mavon-editor class="md-editor" ref="editor" :boxShadow="false" :toolbarsFlag="true" :toolbars="md.toolbars" @save="handleSave"></mavon-editor>
  </div>
</div>
</template>
<script>
import ComHelpCard from '~/components/markdown/HelpCard'
export default {
  layout: 'editor',
  components: { ComHelpCard },
  data() {
    return {
      md: {},
      posterMenuVisible: false
    }
  },
  methods: {
    handleSave(a, b) {
      console.log(a, b)
    }
  },
  mounted() {
    const { editor } = this.$refs
    this.md = {
      toolbars: {
        ...editor.toolbars,
        ...{
          fullscreen: false,
          subfield: false,
          preview: false,
          navigation: false,
          readmodel: false
        }
      }
    }
  }
}
</script>
<style lang="less">
.page-editor {
  height: 100vh;
  display: flex;
  .titlebar {
    display: flex;
    align-items: center;
    height: 64px;
    background-color: #fff;
  }
  .v-note-wrapper {
    z-index: 1;
  }
  .editor-wrapper {
    flex: 1;
  }
  .md-editor {
    overflow: auto;
    height: calc(100% - 64px);
  }
}
</style>