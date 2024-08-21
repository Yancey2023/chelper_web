<script>

import {CHelperCore, wasmInitFuture} from './libCHelperWeb.js'

export default {
  data() {
    return {
      structure: "CHelper正在加载中，请稍候",
      description: "作者：Yancey",
      input: "",
      errorReason: "",
      realSuggestionSize: 0,
      suggestions: []
    }
  },
  created() {
    this.loadWasmModule()
  },
  unmounted() {
    this.release()
  },
  methods: {
    async loadWasmModule() {
      fetch('release-experiment-1.21.20.03.cpack')
          .then((response) => response.arrayBuffer())
          .then(async (cpack) => {
            await wasmInitFuture
            this.core = new CHelperCore(new Uint8Array(cpack))
            this.onTextChanged()
          })
    },
    release() {
      if (this.core != null) {
        this.core.release()
      }
    },
    onTextChanged() {
      this.core.onTextChanged(this.input, this.input.length);
      if (this.input.length === 0) {
        this.structure = "欢迎使用CHelper"
        this.description = "作者：Yancey"
        this.errorReason = ""
      } else {
        this.structure = this.core.getStructure()
        this.description = this.core.getDescription()
        this.errorReason = this.core.getErrorReason()
      }
      this.realSuggestionSize = this.core.getSuggestionSize()
      this.suggestions = []
      this.loadMore(10)
    },
    loadMore(count) {
      // console.log("try load more")
      const start = this.suggestions.length
      const end = Math.min(start + count, this.realSuggestionSize)
      for (let i = start; i < end; i++) {
        this.suggestions.push({
          title: this.core.getSuggestionTitle(i),
          description: this.core.getSuggestionDescription(i),
        })
      }
    },
    onSuggestionScroll() {
      if (this.$refs.listRef.scrollTop + this.$refs.listRef.clientHeight >= this.$refs.listRef.scrollHeight - 50) {
        this.loadMore(10)
      }
    },
    onSuggestionClick(which) {
      this.$refs.inputRef.focus()
      this.core.onSuggestionClick(which)
      this.input = this.core.getStringAfterSuggestionClick()
      this.$refs.inputRef.selectionStart = this.$refs.inputRef.selectionEnd = this.core.getSelectionAfterSuggestionClick()
      this.onTextChanged()
    },
    openSettings() {
      window.alert("暂时还没有设置")
    },
    copy() {
      navigator.clipboard.writeText(this.input)
          .catch(function (reason) {
            window.alert("复制失败：" + reason)
          });
    }
  }
};
</script>

<template>
  <div class="container">
    <header class="header">
      <div>
        <div class="text-structure custom-font">{{ structure }}</div>
        <div class="text-description custom-font">{{ description }}</div>
        <div class="text-error-reason custom-font" v-if="errorReason">{{ errorReason }}</div>
        <div class="line"/>
      </div>
    </header>
    <main ref="listRef" @scroll="onSuggestionScroll">
      <div class="div-suggestion" v-for="(suggestion, index) in suggestions" @click="onSuggestionClick(index - 1)">
        <div class="text-suggestion-name custom-font">{{ suggestion.title }}</div>
        <div class=" text-suggestion-description custom-font">{{ suggestion.description }}</div>
      </div>
    </main>
    <footer>
      <button class="button custom-font" @click="openSettings">设置</button>
      <input ref="inputRef" class="input-box custom-font" placeholder="请输入内容" v-model="input"
             @input="onTextChanged">
      <button class="button custom-font" @click="copy">复制</button>
    </footer>
  </div>
</template>

<style>

.container {
  display: grid;
  height: calc(100vh - 10px);
  grid-template-rows: auto 1fr auto;
}

.line {
  margin: 5px 10px;
  height: 1px;
  background: darkgrey;
}

main {
  flex: 1;
  overflow-y: auto;
}

.text-structure {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #000000;
  background-color: #f5f7fa;
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

.div-suggestion {
  height: auto;
  padding: 5px;
  margin: 0 5px 5px 5px;
  background-color: #f5f7fa;
}

.text-suggestion-name {
  height: auto;
  color: #000000;
  margin: 5px;
}

.text-suggestion-description {
  height: auto;
  color: #666666;
  margin: 5px;
}

footer {
  display: grid;
  left: 20px;
  width: calc(100vw - 10px);
  margin: 5px 5px 0 5px;
  grid-template-columns: auto 1fr auto;
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

</style>