<template>
  <div>
    <commandList
        ref="cmdlstRef"
        :suggestions="suggestions"
        @onSuggestionClick="onSuggestionClick"
        @loadMore="onTextChanged"></commandList>

    <commandEdit
    ref="cmdEdtRef"
    @onTextChanged="onTextChanged"></commandEdit>
  </div>
</template>

<script setup>
import {reactive,ref} from "vue";
import commandList from '@/components/command/commandList.vue'
import commandEdit from '@/components/command/commandEdit.vue'
import getResourceapi from "@/api/GetResourceApi.js";
import {CHelperCore, wasmInitFuture} from "@/libCHelperWeb.js";

const structure = ref("CHelper正在加载中，请稍候");
const description = ref("作者：Yancey");
const suggestions = ref([]);
const errorReason = ref("");
const realSuggestionSize = ref(0);
let core = reactive({});

const cmdlstRef = ref();
const cmdEdtRef = ref();

const a = ref(0)

const loadWasmModule = async function (){
  getResourceapi.getResource().then(async (res)=>{
    await wasmInitFuture
    core = new CHelperCore(new Uint8Array(res.data))
    // onTextChanged()
  })
}

const onTextChanged = function () {
  core.onTextChanged(cmdEdtRef.value.getInputData(), cmdEdtRef.value.getInputData().length);
  if (cmdEdtRef.value.getInputRef().length === 0) {
    structure.value = "欢迎使用CHelper"
    description.value = "作者：Yancey"
    errorReason.value = ""
  } else {
    structure.value = core.getStructure()
    description.value = core.getDescription()
    errorReason.value = core.getErrorReason()
  }
  realSuggestionSize.value = core.getSuggestionSize()
  suggestions.value = []
  loadMore(Math.floor(cmdlstRef.value.getListRef().clientHeight / 25))
  console.log(cmdlstRef.value.getListRef().clientHeight)
}

const init = ()=>{
  console.log(import.meta.env.VITE_BASIC_URL)
  loadWasmModule()
}
init()

const onSuggestionClick = function (which) {
  cmdEdtRef.value.getInputRef().focus()
  core.onSuggestionClick(which)
  cmdEdtRef.value.upDateInput(core.getStringAfterSuggestionClick())
  cmdEdtRef.value.getInputRef().selectionStart = cmdEdtRef.value.getInputRef().selectionEnd = core.getSelectionAfterSuggestionClick()
  onTextChanged()
  window.scrollTo(0,0)
}

const loadMore = function (count) {
  // const start = suggestions.value.length
  // const end = Math.min(start + count, realSuggestionSize.value)
  // for (let i = start; i < end; i++) {
  //   suggestions.value.push({
  //     title: core.getSuggestionTitle(i),
  //     description: core.getSuggestionDescription(i),
  //   })
  // }
  for (let i = 0; i < a.value; i++) {
    suggestions.value.push({
      title: core.getSuggestionTitle(i),
      description: core.getSuggestionDescription(i),
    })
  }
  a.value+=2
}

</script>

<style scoped>

</style>
