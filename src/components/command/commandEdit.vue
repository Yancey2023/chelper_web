<template>
  <div>
    <footer>
      <button class="button custom-font" @click="openSettings">设置</button>
      <input ref="inputRef" class="input-box custom-font" placeholder="请输入内容" v-model="input"
             @input="onTextChanged">
      <button class="button custom-font" @click="copy">复制</button>
    </footer>
  </div>
</template>

<script setup>
const input = ref("");
const openSettings = function() {
  window.alert("暂时还没有设置")
};

defineExpose({
  input
})
</script>

<style scoped>

</style>
