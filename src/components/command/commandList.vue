<template>
  <div ref="listRef"
       infinite-scroll-distance="100"
       v-infinite-scroll="loadMore"
       class="infinite-list"
       style="overflow: auto">

      <div v-for="(suggestion, index) in suggestions"
           @click="onSuggestionClick(index)"
           class="infinite-list-item"
           v-show="suggestion.title">

        <div class="command_text">{{ suggestion.title }}</div>
        <div class="command_desc">{{ suggestion.description }}</div>

      </div>

  </div>
</template>

<script setup>
import {ref} from "vue";
import useCoreStore from "@/pinia/stores/coreStores.js";

const emit = defineEmits(['onSuggestionClick'])

const loadCommandIndex = ref(10);
const suggestions = ref([]);
const listRef = ref();

const getListRef = function (){
  return listRef.value
}

const onSuggestionClick = function (index){
  emit("onSuggestionClick",index)
}

const loadMore = function (){
  suggestions.value = []
  const useCoreStore1 = useCoreStore();
  for (let i = 0; i < loadCommandIndex.value; i++) {
    suggestions.value.push({
      title: useCoreStore1.core.getSuggestionTitle(i),
      description: useCoreStore1.core.getSuggestionDescription(i),
    })
  }

  loadCommandIndex.value += 10

}

const updateCommandLst = function (newSuggestions){
  suggestions.value = newSuggestions
}

defineExpose({
  getListRef,
  updateCommandLst
})

</script>

<style scoped>
.infinite-list {
  height: 85vh;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  padding-top: 7px;
  padding-bottom: 15px;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

.command_desc{
  height: auto;
  color: #666;
  margin: 5px;
}

.command_text{
  height: auto;
  color: #000;
  margin: 5px;
}
</style>
