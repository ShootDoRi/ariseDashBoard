import { createRouter, createWebHistory } from "vue-router";
import AriseBase from "@/pages/AriseBase.vue";

const routes = [
  { path: "/", redirect: "/arise" }, // 기본 경로를 /arise로 리다이렉트
  { path: "/arise", component: AriseBase }, // 대시보드 기본 경로
  { path: "/test", component: () => import("@/pages/test.vue") }, // 테스트 페이지
  // 필요시 다른 라우트도 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
