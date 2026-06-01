import { createRouter, createWebHistory } from "vue-router";
import AriseBase from "@/pages/AriseBase.vue";
import GallBase from "@/pages/GalleryBase.vue";
import NtrBase from "@/pages/NtrBase.vue";
import AllBase from "@/pages/AllBase.vue";

const routes = [
  { path: "/", redirect: "/community-alpha" },
  { path: "/community-alpha", component: GallBase },
  { path: "/community-beta", component: AriseBase },
  { path: "/community-gamma", component: NtrBase },
  { path: "/ranking", component: AllBase },
  { path: "/gallery", redirect: "/community-alpha" },
  { path: "/arise", redirect: "/community-beta" },
  { path: "/ntr", redirect: "/community-gamma" },
  { path: "/all", redirect: "/ranking" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

