<template>
  <div>
    <header>
      <div class="text-structure custom-font">{{ structure }}</div>
      <div class="text-description custom-font">{{ description }}</div>
      <div class="text-error-reason custom-font" v-if="errorReason">{{ errorReason }}</div>
      <div class="line"/>
    </header>
  </div>
</template>

<script setup>
import {ref} from "vue";
const structure = ref("CHelper正在加载中，请稍候");
const description = ref("作者：Yancey");
const errorReason = ref("");

</script>

<style scoped>

</style>
