<template>
  <div>

    <div class="card" style="margin-bottom: 10px;">
      <el-input style="width: 300px; margin-right: 10px" v-model="data.username" placeholder="请输入账号查询" :prefix-icon="Search"/>
      <el-input style="width: 300px; margin-right: 10px" v-model="data.name" placeholder="请输入姓名查询" :prefix-icon="Search"/>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table stripe :data="data.tableData">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="性别" prop="sex"></el-table-column>
        <el-table-column label="生日" prop="birth"></el-table-column>
        <el-table-column label="头像" prop="avatar"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template v-slot="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card">
      <el-pagination  v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                      @current-change="handleCurrentChange"
                      background layout="prev, pager, next" :total="data.total"/>
    </div>
//添加的弹窗
    <el-dialog title="学生信息" width="40%" v-model="data.formVisible">
      <el-form :model="data.form" rules="rules" ref="formRef" label-width="100px" style="padding-right: 50px">
        <el-form-item label="学生姓名">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="data.form.username" autocomplete="off" />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </span>
      </template>
    </el-dialog>

//    编辑的弹窗
    <el-dialog title="学生信息" width="40%" v-model="data.editVisible">
      <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
        <el-form-item label="学生姓名">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="data.form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学生密码">
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </span>
      </template>
    </el-dialog>



  </div>
</template>

<script setup>
import request from "@/utils/request";
import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search} from "@element-plus/icons-vue";

const baseUrl = '/student'


request.get('/').then(res => {
  console.log(res)
})

const data = reactive({
  formVisible: false,
  form: {},
  tableData: [],
  total: 0,
  pageNum: 1,//当前页码
  pageSize: 10,//每页显示多少条
  name: '',
  username: '',
})

const formRef = ref()

const load = () => {
  request.get(baseUrl + '/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      username: data.username,
      name: data.name,
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
    console.log(res)
  })
}
//获取数据
load()

//重置
const reset = () => {
  data.username = ''
  data.name = ''
  load()
}





const handleCurrentChange = (pageNum) => {
  // data.pageNum = pageNum
  load()
  // console.log()
}

//规则
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

const forRef = ref()

//增加课程
const handleAdd = () => {
  data.form = {}
  data.formVisible = true
}

//编辑界面唤醒
const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))   //深拷贝,弹窗显示行数据
  data.editVisible = true
}

//删除操作
const handleDelete = (id) => {
  ElMessageBox.confirm('删除后不可恢复，确定删除吗？', '删除确认',{ type: 'warning'}).then(res => {
  request.delete(baseUrl + '/delete/' + id).then(res => {
    if (res.code === "200") {
      load()    //刷新数据
      ElMessage.success('删除成功')
    }else {
      ElMessage.error(res.msg)
    }
  })
  }).catch(res => {
      ElMessage.error({
      type: 'info',
      message: '已取消删除',
      })
  })

}

//保存数据给数据库
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request.request({
        url: data.form.id ? baseUrl + '/update' : baseUrl + '/add',
        method: data.form.id? 'PUT' : 'POST',
        data: data.form,
      }).then(res => {
        if (res.code === "200") {
          load()    //刷新数据
          data.formVisible = false
          ElMessage.success('保存成功')
        }else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}
</script>