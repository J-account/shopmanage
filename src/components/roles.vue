<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-row>
      <el-col>
        <el-button plain class="btn">朴素按钮</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roles" border class="table" height="400px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 展开之后的内容 -->
          <!-- {{scope.row}} -->
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag type="success" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag type="info" closable>{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    v-for="(item3, i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="250"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="small" plain circle></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="small" plain circle></el-button>
          <!-- 对勾 角色 -->
          <el-button type="success" icon="el-icon-check" size="small" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      console.log(this.roles);
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.table {
  margin-top: 20px;
}
</style>
