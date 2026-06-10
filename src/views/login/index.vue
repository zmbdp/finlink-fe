<script setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { User, Lock } from "@element-plus/icons-vue"
import { useUserStore } from "@/stores/user"
import { login as loginApi } from "@/api/user"

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref()
const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false
})

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" }
  ]
}

const loading = ref(false)
const handleLogin = async () => {
  await loginFormRef.value.validate()
  
  loading.value = true
  try {
    const res = await loginApi({
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe
    })
    
    userStore.setUser(res.data)
    ElMessage.success("登录成功")
    router.push("/")
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo"></div>
      <div class="login-title">
        <h2>资金管理系统</h2>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            class="custom-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            class="custom-input"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item class="remember-item">
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 400px;
  padding: 50px 40px;
  background: white;
  border-radius: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-logo {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border: 8px solid #2979ff;
  border-radius: 16px;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
}

.login-title h2 {
  color: #1a1a1a;
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}

.login-form {
  margin-top: 0;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  background: #f5f7fa;
  border-radius: 20px;
  padding: 8px 16px;
  box-shadow: none;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #2979ff inset;
}

:deep(.el-input__prefix) {
  color: #2979ff;
}

.remember-item {
  margin-bottom: 32px;
}

.remember-item :deep(.el-form-item__content) {
  justify-content: space-between;
}

.login-btn {
  width: 100%;
  height: 56px;
  border-radius: 28px;
  font-size: 20px;
  background: linear-gradient(90deg, #2979ff 0%, #2196f3 100%);
  border: none;
  color: white;
}

.login-btn:hover {
  background: linear-gradient(90deg, #2196f3 0%, #2979ff 100%);
}
</style>
