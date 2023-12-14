<template>
  <div>

    <div class="card" style="margin-bottom: 10px;">
      <el-input style="width: 300px; margin-right: 10px" v-model="data.courseName" placeholder="请输入课程名字查询" :prefix-icon="Search"/>
      <el-input style="width: 300px; margin-right: 10px" v-model="data.studentName" placeholder="请输入学生名称查询" :prefix-icon="Search"/>
      <el-input style="width: 300px; margin-right: 10px" v-model="data.teacher" placeholder="请输入任课老师查询" :prefix-icon="Search"/>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">

      <div>
      <el-table stripe :data="data.tableData">
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="课程名称" prop="courseName"></el-table-column>
        <el-table-column label="学生名称" prop="studentName"></el-table-column>
        <el-table-column label="分数" prop="score"></el-table-column>
        <el-table-column label="评语" prop="comment"></el-table-column>
        <el-table-column label="学生反馈" prop="feedback"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" v-if="data.user.role === 'ADMIN' ">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.id)" v-if="data.user.role === 'ADMIN' ">删除</el-button>
            <el-button type="primary" @click="handleEdit(scope.row)" v-if="data.user.role === 'STUDENT' ">反馈</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>

    <div class="card">
      <el-pagination  v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                      @current-change="handleCurrentChange"
                      background layout="prev, pager, next" :total="data.total"/>
    </div>

// 学生反馈的弹窗
    <el-dialog title="反馈信息" width="40%" v-model="data.formVisible">
      <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
        <el-form-item label="评分" v-if="data.user.role === 'ADMIN'">
          <el-input v-model="data.form.score" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="评语" v-if="data.user.role === 'ADMIN'">
          <el-input type="textarea" v-model="data.form.comment" autocomplete="off"  />
        </el-form-item>
        <el-form-item label="反馈" v-if="data.user.role === 'STUDENT'">
          <el-input type="textarea" v-model="data.form.feedback" autocomplete="off"  />
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
import {reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search} from "@element-plus/icons-vue";

request.get('/').then(res => {
  console.log(res)
})

const data = reactive({
  form: {},
  tableData: [],
  total: 0,
  pageNum: 1,//当前页码
  pageSize: 5,//每页显示多少条
  courseName: '',
  studentName: '',
  teacher: '',
  user: JSON.parse(localStorage.getItem('student-user') || '{}'),
  formVisible: false,
})



const load = () => {
  let params = {
    pageNum: data.pageNum,
    pageSize: data.pageSize,
    courseName: data.courseName,
    studentName: data.studentName,
    teacher: data.teacher,
  }
  if (data.user.role === 'STUDENT') { //如果是学生，则只查询自己的选课记录
    params.studentId = data.user.id
  }
  request.get('/grade/selectPage', {
    params: params
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
    console.log(res)
  })
}
//获取数据
load()

const reset = () => {
  data.courseName = ''
  data.studentName = ''
  data.teacher = ''
  load()
}


const handleCurrentChange = (pageNum) => {
  // data.pageNum = pageNum
  load()
  // console.log()
}


const del = (id) => {
  ElMessageBox.confirm('删除后不可恢复，确定删除吗？', '删除确认',{ type: 'warning'}).then(res => {
    request.delete('/grade/delete/' + id).then(res => {
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

const handleEdit = (row) => {
  //弹一个窗，学生在这里反馈
  data.form = JSON.parse(JSON.stringify(row))  //拷贝本行的数据到表单
  data.formVisible = true

}

//保存到后台
const save = () => {
  request.put('/grade/update', data.form).then(res => {
    if (res.code === "200") {
      load()
      data.formVisible = false
      ElMessage.success('保存成功')
    }else {
      ElMessage.error(res.msg)
    }
  })
}


</script>