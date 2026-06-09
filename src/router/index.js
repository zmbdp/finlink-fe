import { createRouter, createWebHistory } from "vue-router"
import { useUserStore } from "@/stores/user"

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/views/layout/index.vue"),
    redirect: "/home",
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "flow",
        name: "Flow",
        component: () => import("@/views/flow/index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "account",
        name: "Account",
        component: () => import("@/views/account/index.vue"),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.token) {
    next("/login")
  } else if (to.path === "/login" && userStore.token) {
    next("/")
  } else {
    next()
  }
})

export default router
