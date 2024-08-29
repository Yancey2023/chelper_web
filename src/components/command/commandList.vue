<template>
  <div>
    <main ref="listRef" @scroll="onSuggestionScroll">
      <div class="div-suggestion" v-for="(suggestion, index) in suggestions" @click="onSuggestionClick(index)">
        <div class="text-suggestion-name custom-font">{{ suggestion.title }}</div>
        <div class=" text-suggestion-description custom-font">{{ suggestion.description }}</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {ref} from "vue";
defineProps({
  suggestions:{
    default:[]
  }
});

const listRef = ref(null);

const onSuggestionScroll = function () {
  window.addEventListener("resize", () => {
    onSuggestionScroll()
  })
}

const getListRef = function (){
  return listRef.value
}

defineExpose({
  getListRef
})

</script>

<style scoped>

</style>
