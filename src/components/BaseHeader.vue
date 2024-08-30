<template>
  <div>
    <header>
      <div class="text-structure custom-font">{{ structure }}</div>
      <div class="text-description custom-font">{{ description }}</div>
      <div class="text-error-reason custom-font" v-show="errorReason">{{ errorReason }}</div>
      <div class="line"/>
    </header>
  </div>
</template>

<script setup>
import {reactive, computed} from "vue";
import useCoreStore from "@/pinia/stores/coreStores.js";

const coreStore = reactive(useCoreStore())

const structure = computed(()=>{
  return coreStore.structure
})

const description = computed(()=>{
  return coreStore.description
})

const errorReason = computed(()=>{
  return coreStore.errorReason
})

</script>

<style scoped>
.text-structure {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #000000;
  background-color: #f5f7fa;
}

.custom-font {
  font-size: 15px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.text-description {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #666666;
  background-color: #f5f7fa;
}

.text-error-reason {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #FF4444;
  background-color: #f5f7fa;
}

.line {
  margin: 5px 10px;
  height: 1px;
  background: darkgrey;
}

</style>
