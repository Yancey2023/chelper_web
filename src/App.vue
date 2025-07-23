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
      errorReason: '',
      suggestions: [],
      realSuggestionSize: 0,
      isBranchSelectorVisible: false,
    }
  },
  async created() {
    this.core = undefined
    this.setCore(await getCore(DEFAULT_BRANCH))
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      this.onSuggestionScroll()
    })
    this.resizeObserver.observe(this.$refs.listRef)
    this.initEditor()
    this.cursorPollingInterval = setInterval(() => {
      this.onTextChanged()
    }, 100)
  },
  unmounted() {
    this.resizeObserver.disconnect()
    this.release()
    clearInterval(this.cursorPollingInterval)
  },
  methods: {
    initEditor() {
      const editor = this.$refs.editorRef
      editor.addEventListener('input', this.onTextChanged)
      editor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
        }
      })
    },
    saveCursorPosition(container) {
      if (!container.contains(document.activeElement)) {
        return this.lastSelection || 0
      }
      const selection = window.getSelection()
      if (selection.rangeCount === 0) {
        return 0
      }
      const range = selection.getRangeAt(0)
      const preRange = document.createRange()
      preRange.selectNodeContents(container)
      preRange.setEnd(range.startContainer, range.startOffset)
      return preRange.toString().length
    },
    restoreCursorPosition(container, offset) {
      const selection = window.getSelection()
      const range = document.createRange()
      let charCount = 0
      let foundNode = null
      const findNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (charCount + node.length >= offset) {
            foundNode = node
            return true
          }
          charCount += node.length
        } else {
          for (const child of node.childNodes) {
            if (findNode(child)) return true
          }
        }
      }
      findNode(container)
      if (foundNode) {
        const pos = offset - charCount
        range.setStart(foundNode, pos)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    },
    applyHighlight() {
      if (!this.syntaxTokens || this.syntaxTokens.length === 0) {
        return
      }
      const editor = this.$refs.editorRef
      const text = editor.innerText == '\n' ? '' : editor.innerText
      if (!text) {
        editor.innerHTML = ''
        return
      }
      const colors = new Array(text.length).fill(null)
      for (let i = 0; i < this.syntaxTokens.length; i++) {
        const purple = '#9f20a7'
        const orange = '#d95a53'
        const lightBlue = '#0fa0c8'
        const blue = '#4571e1'
        const lightGreen = '#4fad63'
        const green = '#07c160'
        const lightYellow = '#d4ac0d'
        const yellow = '#836c0a'
        switch (this.syntaxTokens[i]) {
          case 1:
            // boolean
            colors[i] = lightGreen
            break
          case 2:
            // float
            colors[i] = lightGreen
            break
          case 3:
            // integer
            colors[i] = lightGreen
            break
          case 4:
            // symbol
            colors[i] = lightGreen
            break
          case 5:
            // id
            colors[i] = lightYellow
            break
          case 6:
            // target selector
            colors[i] = green
            break
          case 7:
            // command
            colors[i] = purple
            break
          case 8:
            // bracket1
            colors[i] = yellow
            break
          case 9:
            // bracket2
            colors[i] = purple
            break
          case 10:
            // bracket3
            colors[i] = blue
            break
          case 11:
            // string
            colors[i] = orange
            break
          case 12:
            // null
            colors[i] = lightBlue
            break
          case 13:
            // range
            colors[i] = lightBlue
            break
          case 14:
            // literal
            colors[i] = lightBlue
            break
          default:
            // unknown
            colors[i] = '#000000'
            break
        }
      }
      const cursorPos = this.saveCursorPosition(editor)
      let html = ''
      for (let i = 0; i < text.length; i++) {
        html += `<span style="color:${colors[i]}">${text[i]}</span>`
      }
      editor.innerHTML = html
      this.restoreCursorPosition(editor, cursorPos)
    },
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
    updateSuggestions() {
      this.realSuggestionSize = this.core.getSuggestionSize()
      this.suggestions = []
      this.loadMore(Math.floor(this.$refs.listRef.clientHeight / 25))
      this.$nextTick(() => {
        const editor = this.$refs.editorRef
        editor.scrollLeft = editor.scrollWidth
      })
    },
    onTextChanged() {
      const editor = this.$refs.editorRef
      const input = editor.innerText == '\n' ? '' : editor.innerText
      const cursorPosition = this.saveCursorPosition(editor)
      if (input.length === 0) {
        this.lastInput = input
        this.lastSelection = cursorPosition
        this.structure = '欢迎使用CHelper'
        this.description = '作者：Yancey'
        this.errorReason = ''
        if (this.core !== undefined) {
          this.core.onTextChanged(input, cursorPosition)
          this.updateSuggestions()
        }
        return
      }
      if (this.core === undefined) {
        return
      }
      if (input === this.lastInput) {
        if (cursorPosition === this.lastSelection) {
          return
        }
        this.lastSelection = cursorPosition
        this.core.onSelectionChanged(cursorPosition)
      } else {
        this.lastInput = input
        this.lastSelection = cursorPosition
        this.core.onTextChanged(input, cursorPosition)
        this.structure = this.core.getStructure()
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
        this.syntaxTokens = this.core.getSyntaxTokens()
        this.applyHighlight()
      }
      this.description = this.core.getDescription()
      this.updateSuggestions()
    },
    loadMore(count) {
      if (this.core === undefined) {
        return
      }
      const start = this.suggestions.length
      const end = Math.min(start + count, this.realSuggestionSize)
      for (let i = start; i < end; i++) {
        this.suggestions.push(this.core.getSuggestion(i))
      }
    },
    onSuggestionScroll() {
      if (
        this.$refs.listRef.scrollTop + 2 * this.$refs.listRef.clientHeight >=
        this.$refs.listRef.scrollHeight
      ) {
        this.loadMore(this.$refs.listRef.clientHeight / 25)
      }
    },
    onSuggestionClick(which) {
      if (this.core === undefined) {
        return
      }
      const editor = this.$refs.editorRef
      editor.focus()
      const clickSuggestionResult = this.core.onSuggestionClick(which)
      if (clickSuggestionResult == null) {
        return
      }
      if (clickSuggestionResult.newText != (editor.innerText == '\n' ? '' : editor.innerText)) {
        editor.innerText = clickSuggestionResult.newText
      }
      this.restoreCursorPosition(editor, clickSuggestionResult.cursorPosition)
      this.onTextChanged()
    },
    selectBranch() {
      this.openBranchSelector()
    },
    copy() {
      const editor = this.$refs.editorRef
      navigator.clipboard
        .writeText(editor.innerText == '\n' ? '' : editor.innerText)
        .catch(function (reason) {
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
    <main ref="listRef" @scroll="onSuggestionScroll">
      <div class="div-suggestion" v-for="item in suggestions" @click="onSuggestionClick(item.id)">
        <div class="text-suggestion-name">{{ item.title }}</div>
        <div class="text-suggestion-description">{{ item.description }}</div>
      </div>
    </main>
    <footer>
      <div class="below">
        <button class="button" @click="selectBranch">分支</button>
        <div
          ref="editorRef"
          class="input-box editor"
          contenteditable="true"
          spellcheck="false"
        ></div>
        <button class="button" @click="copy">复制</button>
      </div>
      <div class="beian">
        <a class="beianlink" href="https://beian.miit.gov.cn/shouye.html">粤ICP备2024307783号</a>
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
  height: calc(var(--vh, 1vh) * 100);
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
  white-space: pre-wrap;
}

.text-description {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #666666;
  background-color: #f5f7fa;
  border-radius: 5px;
  white-space: pre-wrap;
}

.text-error-reason {
  height: auto;
  padding: 10px;
  margin: 5px 5px 0 5px;
  color: #ff4444;
  background-color: #f5f7fa;
  border-radius: 5px;
  white-space: pre-wrap;
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
  align-items: center;
}

.editor {
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
  overflow-x: auto;
  white-space: pre;
  word-wrap: normal;
}

.editor:focus {
  background-color: #ffffff;
  outline: 2px solid #007bff;
}

.editor span {
  display: inline;
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

.beian {
  left: 0;
  width: calc(100vw - 10px);
  text-align: center;
  padding-bottom: 5px;
}

.beianlink {
  color: #666666;
  text-decoration: none;
  font-size: 13px;
  text-align: center;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.beianlink:hover {
  color: dodgerblue;
  text-decoration: underline;
}
</style>
