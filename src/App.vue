<template>
  <div class="container">
    <header class="header">
      <div>
        <div class="text-structure">{{ structure }}</div>
        <div class="text-description">{{ description }}</div>
        <div class="text-error-reason" v-if="errorReason">{{ errorReason }}</div>
        <div class="line"/>
      </div>
    </header>
    <main ref="listRef" @scroll="onSuggestionScroll">
      <div class="div-suggestion" v-for="(suggestion, index) in suggestions" @click="onSuggestionClick(index)">
        <div class="text-suggestion-name">{{ suggestion.title }}</div>
        <div class=" text-suggestion-description">{{ suggestion.description }}</div>
      </div>
    </main>
    <footer>
      <div class="below">
        <button class="button" @click="selectBranch">分支</button>
        <input ref="inputRef" class="input-box" placeholder="请输入内容" v-model="input"
               @input="onTextChanged">
        <button class="button" @click="copy">复制</button>
      </div>
      <div class="beian">
        <a class="beianlink" href="https://beian.miit.gov.cn/shouye.html">粤ICP备2024307783号</a>
      </div>
    </footer>
    <SelectorModal
        :data="getAllBranch()"
        :showNames="getAllBranchChinese()"
        :show="isBranchSelectorVisible"
        @close="closeBranchSelector"
        @select="onBranchSelect"
    />
  </div>
</template>

<script>
import {ALL_BRANCH, ALL_BRANCH_CHINESE, DEFAULT_BRANCH, getCore} from "@/core/CPackManager.js";
import SelectorModal from "@/components/SelectorModal.vue";

export default {
  components: {
    SelectorModal
  },
  data() {
    return {
      structure: "CHelper正在加载中，请稍候",
      description: "作者：Yancey",
      input: "",
      errorReason: "",
      realSuggestionSize: 0,
      suggestions: [],
      isBranchSelectorVisible: false
    }
  },
  async created() {
    this.core = undefined;
    this.setCore(await getCore(DEFAULT_BRANCH));
  },
  mounted() {
    this.resetVhAndPx();
    window.addEventListener("resize", () => {
      this.onSuggestionScroll();
      this.resetVhAndPx();
    });
  },
  unmounted() {
    this.release();
  },
  methods: {
    resetVhAndPx() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.fontSize = document.documentElement.clientWidth / 375 + 'px';
    },
    setCore(newCore) {
      if (this.core !== undefined) {
        this.core.release();
      }
      this.core = newCore;
      this.onTextChanged();
    },
    release() {
      if (this.core === undefined) {
        return;
      }
      this.core.release()
      this.core = undefined;
    },
    onTextChanged() {
      if (this.core === undefined) {
        return;
      }
      this.core.onTextChanged(this.input, this.input.length)
      if (this.input.length === 0) {
        this.structure = "欢迎使用CHelper";
        this.description = "作者：Yancey";
        this.errorReason = "";
      } else {
        this.structure = this.core.getStructure();
        this.description = this.core.getDescription();
        this.errorReason = this.core.getErrorReason();
      }
      this.realSuggestionSize = this.core.getSuggestionSize();
      this.suggestions = [];
      this.loadMore(Math.floor(this.$refs.listRef.clientHeight / 25));
      this.$refs.inputRef.scrollTo({
        left: this.$refs.inputRef.scrollWidth,
        behavior: "smooth",
      })
    },
    loadMore(count) {
      if (this.core === undefined) {
        return;
      }
      const start = this.suggestions.length;
      const end = Math.min(start + count, this.realSuggestionSize);
      for (let i = start; i < end; i++) {
        this.suggestions.push({
          title: this.core.getSuggestionTitle(i),
          description: this.core.getSuggestionDescription(i),
        })
      }
    },
    onSuggestionScroll() {
      if (this.$refs.listRef.scrollTop + 2 * this.$refs.listRef.clientHeight >= this.$refs.listRef.scrollHeight) {
        this.loadMore(this.$refs.listRef.clientHeight / 25);
      }
    },
    onSuggestionClick(which) {
      if (this.core === undefined) {
        return;
      }
      this.$refs.inputRef.focus();
      this.core.onSuggestionClick(which);
      this.input = this.core.getStringAfterSuggestionClick();
      this.$refs.inputRef.selectionStart = this.$refs.inputRef.selectionEnd = this.core.getSelectionAfterSuggestionClick();
      this.onTextChanged();
    },
    selectBranch() {
      this.openBranchSelector();
    },
    copy() {
      navigator.clipboard.writeText(this.input)
          .catch(function (reason) {
            window.alert("复制失败：" + reason);
          })
    },
    getAllBranch() {
      return ALL_BRANCH;
    },
    getAllBranchChinese() {
      return ALL_BRANCH_CHINESE;
    },
    openBranchSelector() {
      this.isBranchSelectorVisible = true;
    },
    closeBranchSelector() {
      this.isBranchSelectorVisible = false;
    },
    async onBranchSelect(branch) {
      console.log('Selected branch:', branch);
      this.setCore(await getCore(branch));
    }
  }
}
</script>

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
  color: #FF4444;
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
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
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
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.beianlink:hover {
  color: dodgerblue;
  text-decoration: underline;
}

</style>