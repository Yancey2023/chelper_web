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
import {ref} from "vue";

const input = ref("");
const inputRef = ref()

const emit = defineEmits(['onTextChanged'])
const openSettings = function() {
  window.alert("暂时还没有设置")
};

const getInputRef = function (){
  return inputRef.value
}

const getInputData = function (){
  return input.value
}

const upDateInput = function (newData){
  input.value = newData
}

const onTextChanged = function (){
  emit("onTextChanged")
}

defineExpose({
  input,
  getInputRef,
  upDateInput,
  getInputData
})
</script>

<style scoped>

</style>
