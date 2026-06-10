<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { ElMessageBox, ElMessage } from "element-plus"
import { User, ArrowDown } from "@element-plus/icons-vue"
import { logout as logoutApi } from "@/api/user"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const breadcrumbs = computed(() => {
  const path = route.path
  if (path === "/home") {
    return [{ title: "首页" }]
  } else if (path === "/flow") {
    return [{ title: "首页", path: "/home" }, { title: "流水管理" }]
  } else if (path === "/account") {
    return [{ title: "首页", path: "/home" }, { title: "账号管理" }]
  }
  return []
})

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm("确定要退出登录吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    
    await logoutApi()
    userStore.logout()
    ElMessage.success("退出成功")
    router.push("/login")
  } catch (error) {
    if (error !== "cancel") {
      console.error(error)
    }
  }
}

const handleBreadcrumbClick = (item) => {
  if (item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <div class="layout-container">
    <el-header class="header">
      <div class="header-left">
        <h1 class="title">资金管理系统</h1>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleLogout">
          <div class="user-dropdown">
            <el-avatar :size="60" class="user-avatar">
              <User />
            </el-avatar>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <el-main class="main">
      <div class="breadcrumb-bar" v-if="breadcrumbs.length > 0">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item 
            v-for="(item, index) in breadcrumbs" 
            :key="index"
            :to="item.path"
            @click="handleBreadcrumbClick(item)"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="breadcrumb-arrow">
          <ArrowDown />
        </div>
      </div>
      <router-view />
    </el-main>
  </div>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(90deg, #2979ff 0%, #42a5f5 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 120px;
}

.header-left .title {
  color: white;
  font-size: 48px;
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  cursor: pointer;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.3);
}

.main {
  flex: 1;
  padding: 0;
  overflow: auto;
}

.breadcrumb-bar {
  background: #e8eaed;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.breadcrumb-bar :deep(.el-breadcrumb__item) {
  font-size: 24px;
  font-weight: bold;
}

.breadcrumb-bar :deep(.el-breadcrumb__inner) {
  color: #333;
}

.breadcrumb-arrow {
  font-size: 24px;
  color: #666;
}
</style>