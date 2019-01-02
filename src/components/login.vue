<template>
  <div class="login-wrap">
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin()" type="primary" class="btn">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录发送请求
    /* handleLogin () {
      this.$http.post('login', this.formdata)
        .then((res) => {
          //console.log(res)
          const {data: {data, meta:{msg, status}}} = res
          if (status === 200) {
            // 渲染home组件
            this.$router.push({
              name: 'home'
            });
            // 用element中的提示框
            // 1. this.$message({
            //   message: msg,
            //   type: 'success'
            // })
          } else {
             this.$message.error(msg)
          }
        })
    } */
    // 简化上述代码  用es7语法
    async handleLogin () {
      const res = await this.$http.post('login', this.formdata)
      console.log(res) 
      const {data: {data, meta:{msg, status}}} = res
      if (status === 200) {
        // 保存data中的token值(是加密的字符串 将来写其他功能时会用)
        localStorage.setItem('token', data.token)
        // 将来用的时候
        // localStorage.getItem('token')
        // 渲染home组件
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #314052;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .form {
  width: 400px;
  padding: 30px 20px;
  border-radius: 8px;
  background-color: #fff;
}
.login-wrap .form .btn {
  width: 100%;
}
</style>
