<template>
  <div>
    <commandList
        ref="cmdlstRef"
        :suggestions="suggestions"></commandList>
<!--    <commandEdit></commandEdit>-->
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
const input = ref("");
const errorReason = ref("");
const realSuggestionSize = ref(0);
const suggestions = ref([]);
let core = reactive({});

const cmdlstRef = ref();

const loadWasmModule = async function (){
  getResourceapi.getResource().then(async (res)=>{
    await wasmInitFuture
    core = new CHelperCore(new Uint8Array(res.data))
    console.log(core);
    onTextChanged()
  })
}

const onTextChanged = function () {
  core.onTextChanged(input.value, input.value.length);
  if (input.value.length === 0) {
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
  cmdlstRef.value.getListRef().scrollTo(0,0)
}

const init = ()=>{
  console.log(import.meta.env.VITE_BASIC_URL)
  loadWasmModule()
}
init()

const loadMore = function (count) {
  const start = suggestions.value.length
  const end = Math.min(start + count, realSuggestionSize.value)
  for (let i = start; i < end; i++) {
    suggestions.value.push({
      title: core.getSuggestionTitle(i),
      description: core.getSuggestionDescription(i),
    })
  }
}

// const onSuggestionClick = function (which) {
//   this.$refs.inputRef.focus()
//   core.onSuggestionClick(which)
//   input.value = core.getStringAfterSuggestionClick()
//   this.$refs.inputRef.selectionStart = this.$refs.inputRef.selectionEnd = this.core.getSelectionAfterSuggestionClick()
//   onTextChanged()
// }

</script>

<style scoped>

</style>
