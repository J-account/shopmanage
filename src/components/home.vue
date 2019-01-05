<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <img src="@/assets/logo.png" alt>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href class="logout" @click.prevent="handleLogout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏导航 -->
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true" router>
          <el-submenu :index="''+item1.order" v-for="(item1, i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2, i) in item1.children" :key="item2.i">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间区域 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  beforeCreate() {
    if (!localStorage.getItem("token")) {
      // 改标识 跳转到登录页面 并提示
      this.$router.push({
        name: "login"
      });
      this.$message.warning("请先登录");
    }
  },
  created() {
    this.getMenus();
  },
  methods: {
    //获取左侧菜单
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res);
      this.menus = res.data.data;
    },
    handleLogout() {
      localStorage.clear();
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出成功");
    }
  }
};
</script>

<style>
.container {
  background-color: #e8edf3;
  height: 100%;
}
.header {
  background-color: #b1becf;
}
.middle {
  line-height: 60px;
  text-align: center;
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
