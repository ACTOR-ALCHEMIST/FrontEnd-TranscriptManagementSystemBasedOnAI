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

      <div>
      <el-table stripe :data="data.tableData">
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="编号" prop="no"></el-table-column>
        <el-table-column label="学生名称" prop="studentName"></el-table-column>
        <el-table-column label="描述" prop="descr"></el-table-column>
        <el-table-column label="老师" prop="teacher"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template v-slot="scope">
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
            <el-button type="primary" @click="addGrade(scope.row)" v-if="data.user.role === 'ADMIN' ">打分</el-button>
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

// 打分的弹窗
    <el-dialog title="成绩信息" width="40%" v-model="data.formVisible">
      <el-form :model="data.gradeForm" label-width="100px" style="padding-right: 50px">
        <el-form-item label="课程名称">
          <el-input v-model="data.gradeForm.name" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="分数">
          <el-input v-model="data.gradeForm.score" autocomplete="off" />
        </el-form-item>
        <el-form-item label="评语">
          <el-input type="textarea" v-model="data.gradeForm.comment" autocomplete="off" />
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
  tableData: [],
  total: 0,
  pageNum: 1,//当前页码
  pageSize: 5,//每页显示多少条
  name: '',
  no: '',
  teacher: '',
  user: JSON.parse(localStorage.getItem('student-user') || '{}'),
  gradeForm: {},
  formVisible: false,
})



const load = () => {
  let params = {
    pageNum: data.pageNum,
    pageSize: data.pageSize,
    name: data.name,
    no: data.no,
    teacher: data.teacher,
  }
  if (data.user.role === 'STUDENT') { //如果是学生，则只查询自己的选课记录
    params.studentId = data.user.id
  }
  request.get('/studentCourse/selectPage', {
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


const del = (id) => {
  ElMessageBox.confirm('删除后不可恢复，确定删除吗？', '删除确认',{ type: 'warning'}).then(res => {
    request.delete('/studentCourse/delete/' + id).then(res => {
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

const addGrade = (row) => {
  //弹一个窗，输入评语和评分,最后在管理页面显示。12.5-end
  data.formVisible = true
  data.gradeForm.name = row.name
  data.gradeForm.courseId = row.courseId
  data.gradeForm.studentId = row.studentId

}

//保存到后台
const save = () => {
  request.post('/grade/add', data.gradeForm).then(res => {
    if (res.code === "200") {
      data.formVisible = false
      ElMessage.success('保存成功')
    }else {
      ElMessage.error(res.msg)
    }
  })
}


</script>