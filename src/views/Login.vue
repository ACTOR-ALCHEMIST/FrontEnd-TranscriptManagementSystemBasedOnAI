<template>
  <div>
    <div class="login-container">
      <div style="width: 350px"  class="login-box" >
        <div style="font-weight: bold; font-size: 24px; text-align: center; margin-bottom: 30px">登陆</div>
        <el-form :model="form"  :rules="rules" >
          <el-form-item>
            <el-input prefix-icon="User" v-model="data.form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input prefix-icon="lock" type="password" v-model="data.form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="role">
<!--            选择角色-->
            <el-select style="width: 100%" v-model="data.form.role" placeholder="请选择角色">
              <el-option label="管理员" value="ADMIN"></el-option>
              <el-option label="教师" value="TEACHER"></el-option>
              <el-option label="学生" value="STUDENT"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login">登陆</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top: 10px">
          wdnmd还没注册呢？<router-link to="/register">立即注册</router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {reactive} from "vue";
// import login from "@/views/Login.vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
//引入vue3内置对象

const data = reactive({
  form: { role: 'STUDENT' }
})

const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
})

const login = () => {
  // 确保提供了用户名和密码
  if (!data.form.username || !data.form.password) {
    ElMessage.error('请输入用户名和密码');
    return;
  }

  const credentials = {
    username: data.form.username,
    password: data.form.password,
    role: data.form.role
  };

  request.post("/login", credentials).then((res) => {
    if (res.code === '200') { // 修改这里
      ElMessage.success("登陆成功");
      localStorage.setItem('student-user', JSON.stringify(res.data));
      location.href = "/home"; // 跳转主页
    } else {
      ElMessage.error(res.msg); // 修改这里，使用 res.msg 显示错误信息
    }
  });

};



</script>


<style>
.login-container {
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #11A983;
}

.login-box {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 30px;
}
</style>
