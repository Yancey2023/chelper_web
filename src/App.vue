<script>

import {CHelperCore, wasmInitFuture} from './libCHelperWeb.js'
import {ElButton} from 'element-plus'
import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  data() {
    return {
      structure: "CHelper正在加载中，请稍候",
      description: "作者：Yancey",
      input: "",
      errorReason: "",
      showErrorReasons: false,
      suggestionsIndex: []
    };
  },
  created() {
    this.loadWasmModule();
  },
  components: {ElButton, DynamicScroller, DynamicScrollerItem},
  methods: {
    async loadWasmModule() {
      fetch('release-experiment-1.21.1.03.cpack')
          .then((response) => response.arrayBuffer())
          .then(async (cpack) => {
            await wasmInitFuture
            this.core = new CHelperCore(new Uint8Array(cpack))
            this.onTextChanged()
          })
    },
    onTextChanged() {
      this.core.onTextChanged(this.input, this.input.length);
      if (this.input.length === 0) {
        this.structure = "欢迎使用CHelper"
        this.description = "作者：Yancey"
        this.errorReason = this.core.getErrorReason()
        this.showErrorReasons = false
      } else {
        this.structure = this.core.getStructure()
        this.description = this.core.getDescription()
        this.errorReason = this.core.getErrorReason()
        this.showErrorReasons = this.errorReason.length > 0
      }
      const suggestionsSize = this.core.getSuggestionSize();
      const suggestionsIndex = [];
      for (let i = 0; i < suggestionsSize; i++) {
        suggestionsIndex.push(i)
      }
      this.suggestionsIndex = suggestionsIndex
    },
    getSuggestionTitle(which) {
      console.log("getSuggestionTitle: " + which)
      return this.core.getSuggestionTitle(which)
    },
    getSuggestionDescription(which) {
      return this.core.getSuggestionDescription(which)
    },
    onSuggestionClick(which) {
      this.$refs.inputRef.focus()
      this.input = this.core.onSuggestionClick(which)
      this.onTextChanged()
    },
    openSettings() {
      window.alert("暂时还没有设置")
    },
    copy() {
      window.clipboardData.setData("Text", "text")
    }
  }
};
</script>

<template>
  <el-container class="container" direction="vertical">
    <el-header class="header">
      <el-container direction="vertical">
        <div class="text-structure custom-font">{{ structure }}</div>
        <div class="text-description custom-font">{{ description }}</div>
        <div class="text-error-reason custom-font" v-if="showErrorReasons">{{ errorReason }}</div>
        <el-divider class="line"/>
      </el-container>
    </el-header>
    <el-main class="main">
      <!--      <DynamicScroller-->
      <!--          class="scroller"-->
      <!--          :min-item-size="0"-->
      <!--          :items="suggestionsIndex">-->
      <!--        <template v-slot="{ item, index, active }">-->
      <!--          <DynamicScrollerItem-->
      <!--              :item="item"-->
      <!--              :active="active"-->
      <!--              :size-dependencies="[item.message]"-->
      <!--              :data-index="index">-->
      <!--            <div class=" text-suggestion-name row-content custom-font">{{ getSuggestionTitle(item) }}</div>-->
      <!--            <div class=" text-suggestion-description row-content custom-font">{{ getSuggestionDescription(item) }}</div>-->
      <!--          </DynamicScrollerItem>-->
      <!--        </template>-->
      <!--      </DynamicScroller>-->
      <div v-for="index in suggestionsIndex">
        <div class="div-suggestion" @click="onSuggestionClick(index)">
          <div class="text-suggestion-name row-content custom-font">{{ "getSuggestionTitle(index)" }}
          </div>
          <div class=" text-suggestion-description row-content custom-font">{{ "getSuggestionDescription(index)" }}
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <el-row type="flex" justify="space-between">
        <el-col class="div-button-left" :span="3">
          <el-button class="button custom-font" type="primary" @click="openSettings">设置</el-button>
        </el-col>
        <el-col :span="18">
          <el-input ref="inputRef" class="input-box custom-font" placeholder="请输入内容" v-model="input"
                    @input="onTextChanged"></el-input>
        </el-col>
        <el-col class="div-button-right" :span="3">
          <el-button class="button custom-font" type="primary" @click="copy">复制</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<style>

.line {
  margin: 5px 0;
  height: 1px;
}

.main {
  padding: 0 20px;
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: auto;
}

.text-structure {
  height: auto;
  padding: 10px;
  margin: 5px 0 0 0;
  color: #000000;
  background-color: #f5f7fa;
}

.text-description {
  height: auto;
  padding: 10px;
  margin: 5px 0 0 0;
  color: #666666;
  background-color: #f5f7fa;
}

.text-error-reason {
  height: auto;
  padding: 10px;
  margin: 5px 0 0 0;
  color: #FF4444;
  background-color: #f5f7fa;
}

.div-suggestion {
  height: auto;
  padding: 5px;
  margin: 0 0 5px 0;
  background-color: #f5f7fa;
}

.text-suggestion-name {
  height: auto;
  color: #000000;
}

.text-suggestion-description {
  height: auto;
  color: #666666;
}

.row-content {
  margin: 5px;
}

.div-button-left {
  text-align: left;
}

.div-button-right {
  text-align: right;
}

.button {
  height: 34px;
  margin: 10px 0;
  text-align: center;
}

.input-box {
  height: 34px;
  margin-top: 10px;
  color: black;
}

.custom-font {
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

</style>