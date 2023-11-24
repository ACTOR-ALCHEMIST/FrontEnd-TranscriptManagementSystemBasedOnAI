<template>
  <div>
    <h1>Article {{ articleList.title }}</h1>
    <p>ID: {{ articleList.content }}</p>
    <p v-for="item in articleList.comments" :key="item.id">
      内容: {{ item.content }}
      <br>
      作者: {{ item.author }}
      <br>
      时间: {{ item.created }}
    </p>
    <!-- 其他组件内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import request from "@/utils/request";
import axios from 'axios';

const userId = ref('');
const route = useRoute();
const articleList = ref('');

onMounted(() => {
  // 使用 route.params.id 获取路由参数 id
  userId.value = route.params.id;
  load(userId.value);
  // 在这里可以根据 userId 请求相应的数据
  // 例如：request.get(`/blog/${userId.value}`).then(response => { /* 处理数据 */ });
});




// const getArticleById = (id) => {
//   axios.get('/blog/getArticleById', {
//     params: {
//       id: id,
//     }
//   })
//       .then(response => {
//         const res = response.data;
//         if (res.code === 200) {
//           // 请求成功，处理返回的文章数据
//           const article = res.data;
//           console.log(article);
//         } else {
//           // 请求失败，处理错误信息
//           console.error('请求失败：', res.message);
//         }
//       })
//       .catch(error => {
//         console.error('请求出错：', error);
//       });
// };
// getArticleById(userId.value)

const load = (id) => {
  request.get('/blog/getArticleById', {
    params: {
      id: id,
    },
  }) .then(response => {
   console.log(response.code==="200")
        const res = response;
        if (res.code === "200") {
          // 请求成功，处理返回的文章数据
        articleList.value = res.data;
          console.log("输出：",article);
        } else {
          // 请求失败，处理错误信息
          console.error('请求失败：', res.message);
        }
      })
      .catch(error => {
        console.error('请求出错：', error);
      });
};
//获取数据
console.log("测试：",userId.value);

</script>
