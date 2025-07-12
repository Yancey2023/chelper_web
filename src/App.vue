<script>
import { ALL_BRANCH, ALL_BRANCH_CHINESE, DEFAULT_BRANCH, getCore } from '@/core/CPackManager.js'
import SelectorModal from '@/components/SelectorModal.vue'

export default {
  components: {
    SelectorModal,
  },
  data() {
    return {
      ALL_BRANCH: ALL_BRANCH,
      ALL_BRANCH_CHINESE: ALL_BRANCH_CHINESE,
      structure: 'CHelper正在加载中，请稍候',
      description: '作者：Yancey',
      input: '',
      errorReason: '',
      suggestions: [],
      isBranchSelectorVisible: false,
    }
  },
  mounted() {
    this.core = undefined
    getCore(DEFAULT_BRANCH).then((core) => {
      this.setCore(core)
    })
  },
  unmounted() {
    this.release()
  },
  methods: {
    setCore(newCore) {
      if (this.core !== undefined) {
        this.core.release()
      }
      this.core = newCore
      this.onTextChanged()
    },
    release() {
      if (this.core === undefined) {
        return
      }
      this.core.release()
      this.core = undefined
    },
    onTextChanged() {
      if (this.core === undefined) {
        return
      }
      this.core.onTextChanged(this.input, this.input.length)
      if (this.input.length === 0) {
        this.structure = '欢迎使用CHelper'
        this.description = '作者：Yancey'
        this.errorReason = ''
      } else {
        this.structure = this.core.getStructure()
        this.description = this.core.getDescription()
        const errorReasons = this.core.getErrorReasons()
        if (errorReasons.length === 0) {
          this.errorReason = ''
        } else if (errorReasons.length === 1) {
          this.errorReason = errorReasons[0].errorReason
        } else {
          this.errorReason = '可能的错误原因：'
          for (let i = 0; i < errorReasons.length; i++) {
            this.errorReason += `\n${i + 1}. ${errorReasons[i].errorReason}`
          }
        }
      }
      this.suggestions = this.core.getAllSuggestions()
      this.$refs.inputRef.scrollTo({
        left: this.$refs.inputRef.scrollWidth,
        behavior: 'smooth',
      })
    },
    onSuggestionClick(which) {
      if (this.core === undefined) {
        return
      }
      this.$refs.inputRef.focus()
      const clickSuggestionResult = this.core.onSuggestionClick(which)
      if (clickSuggestionResult == null) {
        return
      }
      this.input = clickSuggestionResult.newText
      this.$refs.inputRef.selectionStart = clickSuggestionResult.cursorPosition
      this.$refs.inputRef.selectionEnd = clickSuggestionResult.cursorPosition
      this.onTextChanged()
    },
    selectBranch() {
      this.openBranchSelector()
    },
    copy() {
      navigator.clipboard.writeText(this.input).catch(function (reason) {
        window.alert('复制失败：' + reason)
      })
    },
    openBranchSelector() {
      this.isBranchSelectorVisible = true
    },
    closeBranchSelector() {
      this.isBranchSelectorVisible = false
    },
    async onBranchSelect(branch) {
      this.setCore(await getCore(branch))
    },
  },
}
</script>

<template>
  <div class="container">
    <header class="header">
      <div>
        <div class="text-structure">{{ structure }}</div>
        <div class="text-description">{{ description }}</div>
        <div class="text-error-reason" v-if="errorReason">{{ errorReason }}</div>
        <div class="line"></div>
      </div>
    </header>
    <main ref="listRef">
      <div class="div-suggestion" v-for="item in suggestions" @click="onSuggestionClick(item.id)">
        <div class="text-suggestion-name">{{ item.title }}</div>
        <div class="text-suggestion-description">{{ item.description }}</div>
      </div>
    </main>
    <footer>
      <div class="below">
        <button class="button" @click="selectBranch">分支</button>
        <input
          ref="inputRef"
          class="input-box"
          placeholder="请输入内容"
          v-model="input"
          @input="onTextChanged"
        />
        <button class="button" @click="copy">复制</button>
      </div>
    </footer>
    <SelectorModal
      :title="'选择分支'"
      :data="this.ALL_BRANCH"
      :showNames="this.ALL_BRANCH_CHINESE"
      :show="isBranchSelectorVisible"
      @close="closeBranchSelector"
      @select="onBranchSelect"
    />
  </div>
</template>

<style scoped>
.container {
  display: grid;
  width: 100vw;
  height: 100vh;
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
  border-radius: 5px;
}

.text-description {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #666666;
  background-color: #f5f7fa;
  border-radius: 5px;
}

.text-error-reason {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #ff4444;
  background-color: #f5f7fa;
  border-radius: 5px;
}

.div-suggestion {
  height: auto;
  padding: 5px;
  margin: 0 5px 5px 5px;
  background-color: #f5f7fa;
  border-radius: 5px;
  cursor: pointer;
}

.div-suggestion:hover {
  background-color: #f5f5f5;
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

.below {
  display: grid;
  left: 20px;
  width: calc(100vw - 10px);
  margin: 5px;
  grid-template-columns: auto 1fr auto;
}

.input-box {
  margin: 0 5px 0 5px;
  width: calc(100vw - 140px);
  height: auto;
  color: black;
  text-align: left;
  background-color: white;
  padding: 10px;
  border: 0;
  border-radius: 5px;
  outline: 1px solid lightgrey;
}

.input-box:hover {
  background-color: #ffffff;
}

.input-box:focus {
  background-color: #ffffff;
  outline: 2px solid #007bff;
}

.button {
  padding: 5px;
  border: 0;
  width: 50px;
  height: auto;
  color: #f5f7fa;
  text-align: center;
  background: #007bff;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #0070ff;
}

* {
  font-size: 15px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>
