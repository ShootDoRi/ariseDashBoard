import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import Dashboard from "./components/Dashboard.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [{ path: "/", component: Dashboard }];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
