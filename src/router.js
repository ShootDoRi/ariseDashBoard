import { createRouter, createWebHistory } from "vue-router";
import AriseBase from "@/pages/AriseBase.vue";
import GallBase from "@/pages/GalleryBase.vue";
import NtrBase from "@/pages/NtrBase.vue";
import AllBase from "@/pages/AllBase.vue";

const routes = [
  { path: "/", redirect: "/gallery" }, // 기본 경로를 /arise로 리다이렉트
  { path: "/gallery", component: GallBase }, // 대시보드 기본 경로
  { path: "/arise", component: AriseBase }, // 대시보드 기본 경로
  { path: "/ntr", component: NtrBase }, // NTR 대시보드 기본 경로
  { path: "/all", component: AllBase }, // NTR 대시보드 기본 경로
  { path: "/test", component: () => import("@/pages/test.vue") }, // 테스트 페이지
  // 필요시 다른 라우트도 추가
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

