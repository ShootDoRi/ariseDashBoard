<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <router-view />
      <UserModal />
    </div>
  </div>
</template>
<script setup>
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import UserModal from "./components/UserModal.vue";
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
  }
}
</style>

<style>
.dashboard,
.main-content {
  padding-top: 56px; /* Topbar 높이만큼 */
}
</style>
