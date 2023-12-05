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
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table stripe :data="data.tableData">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="编号" prop="no"></el-table-column>
        <el-table-column label="描述" prop="descr"></el-table-column>
        <el-table-column label="课时" prop="times"></el-table-column>
        <el-table-column label="老师" prop="teacher"></el-table-column>
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
    <el-dialog title="课程信息" width="40%" v-model="data.formVisible">
      <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
        <el-form-item label="课程名称">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程编号">
          <el-input v-model="data.form.no" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="data.form.descr" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课时">
          <el-input v-model="data.form.times" autocomplete="off" />
        </el-form-item>
        <el-form-item label="任课老师">
          <el-input v-model="data.form.teacher" autocomplete="off" />
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
    <el-dialog title="课程信息" width="40%" v-model="data.editVisible">
      <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
        <el-form-item label="课程名称">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程编号">
          <el-input v-model="data.form.no" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="data.form.descr" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课时">
          <el-input v-model="data.form.times" autocomplete="off" />
        </el-form-item>
        <el-form-item label="任课老师">
          <el-input v-model="data.form.teacher" autocomplete="off" />
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
  formVisible: false,
  form: {},
  tableData: [],
  total: 0,
  pageNum: 1,//当前页码
  pageSize: 5,//每页显示多少条
  name: '',
  no: '',
  teacher: '',
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
    request.delete('/course/delete/' + id).then(res => {
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
  request.request({
    url: data.form.id ? '/course/update' : '/course/add',
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
  console.log(data.form)
}
</script>