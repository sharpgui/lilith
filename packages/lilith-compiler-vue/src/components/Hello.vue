<template>
  <div>
    <input v-model="msg" />
    <p>msg: {{ msg }}</p>
    <p>computed msg: {{ computedMsg }}</p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class App extends Vue {
  // 初始化数据
  msg = 123

  // 声明周期钩子
  mounted() {}

  // 计算属性
  get computedMsg() {
    return 'computed ' + this.msg
  }
}
export default App
</script>