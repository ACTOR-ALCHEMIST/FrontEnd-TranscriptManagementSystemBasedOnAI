<template>
  <div>

    <div class="card" style="margin-bottom: 10px;">
      <el-input style="width: 300px; margin-right: 10px" v-model="data.name" placeholder="请输入课程名字查询" :prefix-icon="Search"/>
      <el-input style="width: 300px; margin-right: 10px" v-model="data.no" placeholder="请输入课程编号查询" :prefix-icon="Search"/>
      <el-input style="width: 300px; margin-right: 10px" v-model="data.teacher" placeholder="请输入任课老师查询" :prefix-icon="Search"/>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button type="info" style="margin: 0 10px" @click="reset">重置</el-button>
    </div>

    <div class="card" style="margin-bottom: 10px">

      <el-table stripe :data="data.tableData">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="编号" prop="no"></el-table-column>
        <el-table-column label="描述" prop="descr"></el-table-column>
        <el-table-column label="课时" prop="times"></el-table-column>
        <el-table-column label="老师" prop="teacher"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template v-slot="scope">
            <el-button type="primary" @click="selectCourse(scope.row)">选课</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card">
      <el-pagination  v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                      @current-change="handleCurrentChange"
                      background layout="prev, pager, next" :total="data.total"/>
    </div>


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
  tableData: [],
  total: 0,
  pageNum: 1,//当前页码
  pageSize: 5,//每页显示多少条
  name: '',
  no: '',
  teacher: '',
  student: JSON.parse(localStorage.getItem('student-user') || '{}'),
})



const load = () => {
  request.get('/course/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name,
      no: data.no,
      teacher: data.teacher,
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
    console.log(res)
  })
}
//获取数据
load()

const reset = () => {
  data.name = ''
  data.no = ''
  data.teacher = ''
  load()
}


const handleCurrentChange = (pageNum) => {
  // data.pageNum = pageNum
  load()
  // console.log()
}


const selectCourse = (row) => {
  request.post('/studentCourse/add', { studentId: data.student.id, name: row.name, no: row.no, courseId: row.id }).then(res => {
    if (res.code === "200") {
      ElMessage.success('选课成功')
      load()
    } else {
      ElMessageBox.alert(res.msg)
      // ElMessageBox.alert("error")
    }
  })
}




</script>