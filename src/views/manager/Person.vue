<template>
  <div>
    <div class="card" style="width: 75%; padding: 40px">
    <el-form :model="data.form" ref="formRef" label-width="100px" style="padding-right: 50px">
      <el-form-item label="学生头像">
        <el-upload style="width: 120px; height: 120px;"
            class="avatar-uploadr"
                   action="http://localhost:8080/files/upload"
                   :show-file-list="false"
                   :on-success="handleImgUploadSuccess">
          <img v-if="data.form.avatar" :src="data.form.avatar" class="avatar" style="width: 100px; border-radius: 8px"/>
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-input v-model="data.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="data.form.username" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="学生密码" prop="password">
        <el-input v-model="data.form.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学生手机">
        <el-input v-model="data.form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学生邮箱">
        <el-input v-model="data.form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="data.form.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="其他"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker style="width: 100%" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="data.form.birth"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="update">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script setup>
  import {reactive, ref} from "vue";
  import {ElMessage} from "element-plus";
  import router from "@/router";
  import request from "@/utils/request";

  const data = reactive({
    form: JSON.parse(localStorage.getItem('student-user') || "{}")
  })

  const handleImgUploadSuccess = (res) => {
    // console.log(res)
    data.form.avatar = res.data
  }

  const update = () => {
    request.put('/student/update', data.form).then(res => {
      if (res.code === "200") {
        ElMessage.success('保存成功')
        router.push('/login')
      }else {
        ElMessage.error(res.msg)
      }
    })
  }
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-upload el-upload--text {
  width: 10px;

}
</style>