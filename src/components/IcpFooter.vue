<script>
export default {
  computed: {
    icpText() {
      return import.meta.env.VITE_ICP_TEXT
    },
  },
}
</script>

<template>
  <div class="icp" v-if="icpText">
    <a class="icpLink" href="https://beian.miit.gov.cn/shouye.html">{{ icpText }}</a>
  </div>
</template>

<style scoped>
.icp {
  left: 0;
  width: calc(100vw - 10px);
  text-align: center;
  padding-bottom: 5px;
}

.icpLink {
  color: #666666;
  text-decoration: none;
  font-size: 13px;
  text-align: center;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.icpLink:hover {
  color: dodgerblue;
  text-decoration: underline;
}
</style>
