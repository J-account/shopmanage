<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row>
      <el-col>
        <el-input
          placeholder="请输入用户"
          class="input-with-select"
          v-model="query"
          clearable
          @clear="getAllUsers()"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格展示数据 
      el-table需要通过data属性提供数据源tableData
      每一列el-table-column 中的label是表头文字  prop是该列中的数据名
      prop数据来源是el-table中的data属性值[{prop要用的数据名: 值}]

      注意： 当表格单元格中数据展示不是正常普通文本的时候  则在数据展示外边套一个template
          属性 slot-scope: 上下级传递数据， 会自动去找上一级数据源tableData 即此时的scope=tableData 
          scope.row就是数组中的每一个对象
    -->
    <el-table class="table" :data="tableData" height="300px" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <!--属性 slot-scope 会自动去找上一级数据源tableData 即此时的scope=tableData -->
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <el-switch
            @change="changeUserState(scope.row)"
            v-model="scope.row.mg_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="180">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="showDiaEdit(scope.row)"
            plain
            circle
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            circle
            @click="showDel(scope.row)"
          ></el-button>
          <!-- 对勾 角色 -->
          <el-button
            @click="showRole(scope.row)"
            type="success"
            icon="el-icon-check"
            size="small"
            plain
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="3"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加表单 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话:" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户表单 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话:" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">、
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUserName}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 
            v-model绑定数据 ，若绑定的数据和option中的value值相同 则默认显示的是该option
             当点击不同的option时 v-model绑定的数据随之变化,变成了点击的option的value值
          -->
          <el-select v-model="currUserRoleId" placeholder="请选择角色">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(v, i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      tableData: [],
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // 下拉框绑定的数据
      currUserRoleId: "-1",
      //下拉框roles
      roles: [],
      currUserName: "",
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色----设置角色
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currUserRoleId
      });
      // console.log(res);
      this.dialogFormVisibleRole = false;
    },
    // 分配角色  --显示对话框
    async showRole(user) {
      // 发送请求
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      // console.log(this.roles);  this.roles中有所有的角色id
      // console.log(user);
      this.currUserName = user.username;
      this.currUserId = user.id;
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.currUserRoleId = res2.data.data.rid;
      this.dialogFormVisibleRole = true;
    },
    // 修改用户状态
    async changeUserState(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      console.log(res)
    },
    // 用户编辑----显示编辑页面表单
    showDiaEdit(userData) {
      // console.log(userData);
      this.form = userData;
      this.dialogFormVisibleEdit = true;
    },
    // 用户编辑 ----发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });

      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      } else {
        this.$http.wraning(msg);
      }
    },
    // 用户删除 ---出现提示框
    showDel(userData) {
      // 点击删除按钮---出现提示框---删除---刷新列表
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userData.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功");
            this.getTableData();
          }
          console.log(res);
        })
        .catch(() => {
          this.$message.warning("已取消删除");
        });
    },
    // 用户添加 ---显示表单
    showDiaAdd() {
      //打开表单后将之前填写的内容先清空
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 用户添加 ---发送请求
    async addUser() {
      // 发送请求---- 关闭对话框 ---- 渲染列表
      const res = await this.$http.post(`users`, this.form);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.dialogFormVisibleAdd = false;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    getAllUsers() {
      this.getTableData();
    },
    // 与搜索有关的功能
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 与分页有关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    // 获取数据
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res)
      const {
        data: {
          data: { total, users },
          meta: { status, msg }
        }
      } = res;
      // 判断 若status==200表示请求成功 获取到数据
      if (status === 200) {
        //  给表格赋值 并提示
        this.total = total;
        this.tableData = users;

        this.$message.success(msg);
      }
    }
  }
};
</script>

<style>
.input-with-select {
  width: 350px;
  margin-top: 15px;
}
</style>
