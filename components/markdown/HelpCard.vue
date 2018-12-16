<template>
<div class="px-2 py-2 com-markdown-helper">
  <v-card class="help-card">
    <v-card-title><h4>快捷键提示</h4></v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-tile v-for="(item, index) in items" :key="index">
        <v-list-tile-content><b>{{item.title}}</b></v-list-tile-content>
        <v-list-tile-content class="align-end">{{item.content}}</v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</div>
</template>
<script>
const items = [
  { title: '**粗体**', content: 'ctrl + b' },
  { title: '*斜体*', content: 'ctrl + i' },
  { title: '# 一级标题', content: 'ctrl + 1' },
  { title: '## 二级标题', content: 'ctrl + 2' },
  { title: '### 三级标题', content: 'ctrl + 3' },
  { title: '#### 四级标题', content: 'ctrl + 4' },
  { title: '##### 五级标题', content: 'ctrl + 5' },
  { title: '###### 六级标题', content: 'ctrl + 6' },
  { title: '++下划线++', content: 'ctrl + u' },
  { title: '~~中划线~~', content: 'ctrl + shift + d' },
  { title: '==标记==', content: 'ctrl + m' },
  { title: '^上角标^', content: 'ctrl + alt + s' },
  { title: '~下角标~', content: 'ctrl + shift + s' },
  { title: '居左对齐', content: 'ctrl + shift + l' },
  { title: '居中对齐', content: 'ctrl + shift + c' },
  { title: '居右对齐', content: 'ctrl + shift + r' },
  { title: '> 段落引用', content: 'ctrl + q' },
  { title: '有序列表', content: 'ctrl + o' },
  { title: '无序列表', content: 'ctrl + alt + u' },
  { title: '[描述](链接)', content: 'ctrl + l' },
  { title: '代码块', content: 'ctrl + alt + c' },
  { title: '表格', content: 'ctrl + alt + t' },
  { title: '上一步', content: 'ctrl + z' },
  { title: '下一步', content: 'ctrl + y' },
  { title: '清空', content: 'ctrl + backspace' }
]
export default {
  data() {
    return {
      items
    }
  }
}
</script>
<style lang="less">
.com-markdown-helper {
  min-width: 256px;
  height: 100%;
  overflow: auto;
  .v-list--dense {
    .v-list__tile {
      height: 24px;
    }
  }
}
</style>