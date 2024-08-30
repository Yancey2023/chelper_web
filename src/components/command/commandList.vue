<template>
  <div ref="listRef">
    <ul v-infinite-scroll="loadMore" class="infinite-list" style="overflow: auto">

      <div v-for="(suggestion, index) in suggestions" @click="onSuggestionClick(index)" class="infinite-list-item">
        <div class="command_text">{{ suggestion.title }}</div>
        <div class="command_desc">{{ suggestion.description }}</div>
      </div>

    </ul>
  </div>
</template>

<script setup>
import {ref} from "vue";
defineProps({
  suggestions:{
    default:[]
  }
});

let suggestions = ref([]);

const emit = defineEmits(['onSuggestionClick','loadMore'])

const listRef = ref();

const getListRef = function (){
  return listRef.value
}

const onSuggestionClick = function (index){
  emit("onSuggestionClick",index)
}

const loadMore = function (){
  emit("loadMore")
}

defineExpose({
  getListRef,
  loadMore
})

</script>

<style scoped>
.infinite-list {
  height: 81vh;
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
