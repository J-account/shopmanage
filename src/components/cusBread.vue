<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  // 如果一个数据来源于该组件本身 则写在data中
  data() {
    return {};
  },
  // 如果一个数据来源于其他组件 则写在props中
  props: ['level1', 'level2']
};
</script>

<style>
</style>
