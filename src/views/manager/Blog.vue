<template>
  <div>
    <el-row>
      <!-- 左侧栅格列，占据6列 -->
      <el-col :span="10">
        <div style="width: 350px" class="login-box">
          <div style="font-weight: bold; font-size: 24px; text-align: center; margin-bottom: 30px">
            Chat
          </div>
          <el-form :model="data">
            <el-form-item>
              <el-input type="textarea" v-model="data.content" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="模型选择" prop="model">
              <el-select style="width: 100%" v-model="data.form.model" placeholder="请选择模型">
                <el-option label="gemini-pro" value="gemini-pro"></el-option>
                <el-option label="gemini-pro-vision" value="gemini-pro-vision"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%" @click="run">send</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <!-- 右侧栅格列，占据3列 -->
      <el-col :span="12">
        <div>
          <p>{{ data.result }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAULR2QicZ4md1FaE2kZ0Iynj5L8o7hNXw'; // 替换为你的 API Key
const genAI = new GoogleGenerativeAI(API_KEY);

const data = reactive({
  result: '',
  content: '',
  form: { model: 'gemini-pro' },
});

const model = genAI.getGenerativeModel({ model: data.form.model });

const run = async () => {
  const prompt = data.content;
  const result = await model.generateContentStream(prompt);
  data.result = '';
  for await (const chunk of result.stream) {
    const chunkText = await chunk.text();
    console.log(chunkText);
    data.result += chunkText;
  }
};
</script>
