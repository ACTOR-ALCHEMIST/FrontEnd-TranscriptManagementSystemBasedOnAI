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

        <el-table-column >
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
        />
        </el-table-column>
        <el-table-column label="名称" prop="title"></el-table-column>
        <el-table-column label="编号" prop="categories"></el-table-column>
        <el-table-column label="描述" prop="tags"></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template v-slot="scope">
            <el-button type="primary" @click="handleEdit">编辑</el-button>
            <el-button type="danger" @click="handleDelete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>



<!--    <el-row-->
<!--        v-for="(item, index) in data.tableData"-->
<!--        :key="item.id"-->
<!--        :span="5"-->
<!--        :offset="index > 0 ? 1 : 0"-->
<!--    >-->
<!--        <el-card :body-style="{ padding: '0px' } ">-->
<!--          <img-->
<!--              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"-->
<!--              class="image"-->
<!--          />-->
<!--          <div style="padding: 14px">-->
<!--            <span>{{item.title}}</span>-->
<!--            <div class="bottom">-->
<!--              <time class="time">{{ currentDate }}</time>-->
<!--              <el-button text class="button" @click="() => getArticle(item.id)">详情</el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--    </el-row>-->




    <div class="card">
      <el-pagination  v-model:current-page="data.pageNum" v-model:page-size="data.pageSize"
                      @current-change="handleCurrentChange"
                      background layout="prev, pager, next" :total="data.total"/>
    </div>

    <el-dialog title="信息" width="40%" v-model="data.formVisible" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="data.form" label-width="100px" style="padding-right: 50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="data.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="descr">
          <el-input v-model="data.form.descr" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.formVisible = false">取 消</el-button>
        <el-button type="primary" @click="data.formVisible = false">保 存</el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import request from "@/utils/request";
import { reactive } from "vue";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

request.get('/').then(res => {
  console.log(res);
});

const data = reactive({
  formVisible: false,
  form: {},
  tableData: [],
  total: 0,
  pageNum: 1, //当前页码
  pageSize: 5, //每页显示多少条
  name: '',
  no: '',
  teacher: '',
});

const load = () => {
  request.get('/blog/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name,
      no: data.no,
      teacher: data.teacher,
    },
  }).then(res => {
    data.tableData = res.data?.list || [];
    data.total = res.data?.total || 0;
    console.log(res);
  });
};
//获取数据
load();

const reset = () => {
  data.name = '';
  data.no = '';
  data.teacher = '';
  load();
};

const handleCurrentChange = (pageNum) => {
  // data.pageNum = pageNum
  load();
  // console.log()
};

const handleAdd = () => {
  data.form = {};
  data.formVisible = true;
};

const router = useRouter();

const handleEdit = (row) => {
  let articleId = row.id;
  // Use router.push to navigate to the 'Article' route with the specific ID
  router.push({ name: 'Article', params: { id: articleId }, query: { msg: 'hello' } });
};

const handleDelete = (id) => {
  ElMessageBox.confirm('删除后数据无法恢复，您确定删除吗?', '删除确认', { type: 'warning' }).then(res => {
    console.log('删除');
  }).catch(err => {
    console.error(err);
  });
};

// Card
// 跳转函数
const getArticle = (itemId) => {
  router.push({
    name: 'Article',
    params: {
      id: itemId,
    },
    query: {
      msg: 'hello',
    },
  });
};
</script>






<style>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}


</style>