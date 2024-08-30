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
.button {
  padding: 5px;
  border: 0;
  width: 50px;
  height: auto;
  color: #f5f7fa;
  text-align: center;
  background: dodgerblue;
  border-radius: 5px;
}

.custom-font {
  font-size: 15px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.input-box {
  margin: 0 5px 0 5px;
  width: calc(100vw - 140px);
  height: auto;
  color: black;
  text-align: left;
  background-color: #f5f7fa;
  padding: 10px;
  border: 0;
  border-radius: 5px;
}

.input-box:focus {
  outline: 2px solid dodgerblue;
}


footer {
  display: grid;
  left: 20px;
  width: calc(100vw - 10px);
  margin: 5px 5px 0 5px;
  grid-template-columns: auto 1fr auto;
}
</style>
