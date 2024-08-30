<template>
  <div>
    <el-row>
      <el-col :span="24">

        <BaseHeader></BaseHeader>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">

        <router-view></router-view>

      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import BaseHeader from "@/components/BaseHeader.vue";


</script>

<style scoped>

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

</style>
