<script>
export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    syntaxTokens: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue(newModelValue, oldModelValue) {
      if (
        newModelValue.text == this.tempModelValue.text ||
        newModelValue.cursorPosition == this.tempModelValue.cursorPosition
      ) {
        return
      }
      if (newModelValue.text != oldModelValue.text) {
        this.setText(newModelValue.text)
        this.setCursorPosition(newModelValue.cursorPosition)
      } else if (newModelValue.selection != oldModelValue.selection) {
        this.setCursorPosition(newModelValue.cursorPosition)
      }
    },
    syntaxTokens() {
      this.applyHighlight()
    },
  },
  data() {
    return {
      value: {
        text: '',
        cursorPosition: 0,
      },
      isComposing: false,
    }
  },
  mounted() {
    this.$refs.editorRef.addEventListener('input', this.updateModelValue)
    this.$refs.editorRef.addEventListener('compositionstart', () => {
      this.isComposing = true
    })
    this.$refs.editorRef.addEventListener('compositionend', () => {
      this.isComposing = false
      this.updateModelValue()
    })
    this.$refs.editorRef.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
    })
    this.ticker = setInterval(this.updateModelValue, 100)
  },
  unmounted() {
    clearInterval(this.ticker)
  },
  methods: {
    updateModelValue() {
      if (this.isComposing) {
        return
      }
      this.tempModelValue = {
        text: this.getText(),
        cursorPosition: this.getCursorPosition(),
      }
      if (
        this.modelValue.text != this.tempModelValue.text ||
        this.modelValue.cursorPosition != this.tempModelValue.cursorPosition
      ) {
        this.$emit('update:modelValue', this.tempModelValue)
      }
    },
    getText() {
      const innerText = this.$refs.editorRef.innerText
      return innerText == '\n' ? '' : innerText
    },
    setText(text) {
      this.$refs.editorRef.innerText = text
    },
    getCursorPosition() {
      const editor = this.$refs.editorRef
      if (!editor.contains(document.activeElement)) {
        return this.modelValue.cursorPosition
      }
      const selection = window.getSelection()
      if (selection.rangeCount === 0) {
        return 0
      }
      const range = selection.getRangeAt(0)
      const preRange = document.createRange()
      preRange.selectNodeContents(editor)
      preRange.setEnd(range.startContainer, range.startOffset)
      return preRange.toString().length
    },
    setCursorPosition(cursorPosition) {
      const selection = window.getSelection()
      const range = document.createRange()
      let charCount = 0
      let foundNode = null
      const findNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (charCount + node.length >= cursorPosition) {
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
      findNode(this.$refs.editorRef)
      if (foundNode) {
        const pos = cursorPosition - charCount
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
      const cursorPosition = this.getCursorPosition()
      let html = ''
      for (let i = 0; i < text.length; i++) {
        html += `<span style="color:${colors[i]}">${text[i]}</span>`
      }
      editor.innerHTML = html
      this.setCursorPosition(cursorPosition)
    },
  },
}
</script>

<template>
  <div ref="editorRef" class="editor" contenteditable="true" spellcheck="false"></div>
</template>

<style scoped>
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
</style>
