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
              <el-tag
                type="success"
                closable
                class="level1"
                @close="deleteRight(scope.row, item1)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    type="info"
                    closable
                    class="level2"
                    @close="deleteRight(scope.row, item2)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    class="level3"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    @close="deleteRight(scope.row, item3)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>该角色未分配权限</span>
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
          <el-button
            type="success"
            icon="el-icon-check"
            size="small"
            plain
            circle
            @click="showDiaRights(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击对勾 弹出树形权限..... -->
    <el-dialog title="角色权限" :visible.sync="dialogFormVisibleRight">
      <!-- 
         是否默认展开所有节点 1. 简单用法 default-expand-all
                            2. 方法2   :default-expanded-keys='expendedArr'
      -->
      <el-tree
        ref="tree"
        :data="treeDate"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      treeDate: [],
      dialogFormVisibleRight: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedArr: [],
      currRoleId: ""
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 设置权限 ---
    async setRight() {
      // console.log(this.$refs.tree);
      
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const arr = [...arr1, ...arr2];

      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      });

      this.getRoles();
      this.dialogFormVisibleRight = false;
    },
    // 设置、分配权限 ---打开对话框
    async showDiaRights(right) {
      // console.log(right);
      // 获取树形结构的所有权限
      const res = await this.$http.get(`rights/tree`);
      this.treeDate = res.data.data;
      this.currRoleId = right.id;
      // 取出当前角色所拥有的权限 tempArr
      const tempArr = [];
      right.children.forEach(item1 => {
        // tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          // tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          });
        });
      });
      // console.log(tempArr);
      this.checkedArr = tempArr;

      this.dialogFormVisibleRight = true;
    },
    // 删除权限
    async deleteRight(role, right) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      // console.log(res);
      // 方法2：更新当前角色的权限  因为删除权限之后会返回该角色的权限的新数据
      role.children = res.data.data;
      // 方法1：删除后 更新整个表格 更新权限
      // this.getRoles();
    },
    // 获取角色
    async getRoles() {
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      // console.log(this.roles);
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
.level1,
.level2,
.level3 {
  margin-top: 15px;
}
</style>
