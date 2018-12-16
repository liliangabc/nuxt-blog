<template>
<div class="page-editor">
  <!-- <com-help-card></com-help-card> -->
  <div class="editor-wrapper">
    <div class="px-3 titlebar">
      <v-text-field class="block font-weight-bold headline" label="输入文章标题..." 
        hide-details single-line full-width v-model="formData.title"></v-text-field>
      <!-- 上传海报 -->
      <v-menu v-model="posterMenuVisible" :close-on-content-click="false" transition="slide-y-transition" min-width="300" offset-y>
        <v-btn icon slot="activator">
          <v-icon color="grey">add_photo_alternate</v-icon>
        </v-btn>
        <div class="white px-3 py-3">
          <div class="subheading font-weight-bold mb-2 grey--text">添加封面大图</div>
          <v-img :aspect-ratio="16/9" :src="formData.poster">
            <v-btn v-if="!formData.poster" style="height: 100%;" class="my-0 btn-add-poster" block depressed @click="handlePosterFileClick">
              点击此处添加图片
            </v-btn>
            <v-layout justify-end>
              <v-btn title="移除这张图片" class="mx-0 my-0" icon @click="handleRemovePoster">
                <v-icon dark>delete_forever</v-icon>
              </v-btn>
            </v-layout>
            <input style="display: none;" type="file" ref="posterFile" accept="image/*" @change="handlePosterFileChange">
          </v-img>
        </div>
      </v-menu>
      <!-- 发布 -->
      <v-btn flat color="info" @click="handleSubmit">
        <v-icon>publish</v-icon>
        发布文章
      </v-btn>
    </div>
    <mavon-editor class="md-editor" ref="editor" 
      v-model="formData.content" :boxShadow="false" :toolbarsFlag="true" :toolbars="md.toolbars"></mavon-editor>
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
      posterMenuVisible: false,
      formData: {}
    }
  },
  methods: {
    handlePosterFileClick() {
      this.$refs.posterFile.click()
    },
    handlePosterFileChange(event) {
      this.$axios.get('/qn/get_token').then(({data}) => {
        let formData = new FormData()
        formData.append('token', data.token)
        formData.append('file', event.target.files[0])
        this.$axios.post(`//${data.host}`, formData).then(({ key }) => {
          this.formData = { ...this.formData, poster: `${data.dlURL}/${key}` }
        })
      })
    },
    handleRemovePoster() {
      this.formData = { ...this.formData, poster: '' }
    },
    handleSubmit() {
      let postData = { ...this.formData, content: this.$refs.editor.d_render }
      this.$axios.post('/article/add', postData).then(data => {
        this.formData = {}
      }).catch(err => alert(err.message))
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
  [type='button'] {
    appearance: none;
  }
}
</style>