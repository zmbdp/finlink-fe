<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const goToFlow = () => {
  router.push("/flow")
}

const goToAccount = () => {
  router.push("/account")
}
</script>

<template>
  <div class="home-container">
    <div class="home-card">
      <div class="card-item" @click="goToFlow">
        <div class="card-icon">📊</div>
        <div class="card-title">流水管理</div>
      </div>
      <div class="card-item" @click="goToAccount">
        <div class="card-icon">🏦</div>
        <div class="card-title">账号管理</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
}

.home-card {
  display: flex;
  gap: 60px;
}

.card-item {
  width: 280px;
  height: 200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.card-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>
