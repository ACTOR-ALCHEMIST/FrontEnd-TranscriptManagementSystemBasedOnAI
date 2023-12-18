<template>
  <div>
    <h1>Article {{ articleList.title }}</h1>
    <p>ID: {{ articleList.content }}</p>
    <p>
      <button  @click="load">Load</button>
    </p>
    <!-- 其他组件内容 -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import request from "@/utils/request";
import axios from 'axios';

const API_KEY = "AIzaSyAULR2QicZ4md1FaE2kZ0Iynj5L8o7hNXw";
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});



const load = () => {
  // For text-only input, use the gemini-pro model
  async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = "Write a story about a magic backpack."

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

  run();
};

</script>
