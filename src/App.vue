<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content" :class="{ mobile: isMobile }">
      <!-- <Topbar /> -->
      <router-view />
      <UserModal />
    </div>
    <Analytics />
  </div>
</template>
<script setup>
import { Analytics } from "@vercel/analytics/vue";
import { watch } from "vue";
import Sidebar from "./components/Sidebar.vue";
//import Topbar from "./components/Topbar.vue";
import UserModal from "./components/UserModal.vue";
import { useIsMobile } from "./composables/useIsMobile";
import { useRoute } from "vue-router";

const route = useRoute();

watch(
  () => route,
  () => {
    console.log("Route changed:", route);
  },
  { immediate: true, deep: true }
);

const isMobile = useIsMobile();
//const
</script>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #181a20;
  overflow: hidden;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #181a20;
  min-width: 0;
  min-height: 0;
  height: 100vh;
  overflow-y: auto;
  padding-top: 0;
}

.main-content.mobile {
  padding: 0;
  padding-top: 56px;
}
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  .main-content {
    height: auto;
    min-height: 0;
    //padding-top: 56px;
  }
}
</style>

<style>
.dashboard,
.main-content {
  //padding-top: 56px; /* Topbar 높이만큼 */
}
</style>
