<template>
  <nav class="sidebar" :class="{ open: isOpen }">
    <div class="logo">
      <span class="hamburger" @click="toggleSidebar" v-if="isTabletOrLess">☰</span>
      <span v-else>DASH BOARD</span>
    </div>
    <transition name="slide">
      <div class="drawer" v-if="isTabletOrLess && isOpen">
        <button class="drawer-close" @click="closeSidebar">✕</button>
        <ul class="drawer-menu">
          <li>DC INSIDE(개발중)</li>
          <li class="active">ARISE</li>
          <li>NTR(개발중)</li>
          <li>Settings(개발중)</li>
        </ul>
      </div>
    </transition>
    <ul class="menu" v-if="!isTabletOrLess">
      <li>DC INSIDE(개발중)</li>
      <li class="active">ARISE</li>
      <li>NTR(개발중)</li>
      <li>Settings(개발중)</li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const isTabletOrLess = ref(false);

function handleResize() {
  isTabletOrLess.value = window.innerWidth <= 1024;
  if (!isTabletOrLess.value) isOpen.value = false;
}

function toggleSidebar() {
  isOpen.value = !isOpen.value;
}
function closeSidebar() {
  isOpen.value = false;
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #181a20;
  color: #fff;
  min-height: 100vh;
  padding: 32px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.2s;
  z-index: 100;
}

ul li {
  cursor: pointer;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hamburger {
  font-size: 2rem;
  cursor: pointer;
  user-select: none;
  margin-right: 8px;
  display: inline-flex;
  align-items: center;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu li.active,
.menu li:hover {
  background: #23232e;
}

/* drawer는 왼쪽에서 슬라이드, 220px만 차지 */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: #181a20;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.18);
  z-index: 2000;
  padding-top: 56px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}
.drawer-close {
  position: absolute;
  top: 14px;
  left: 14px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.drawer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.drawer-menu li {
  padding: 16px 32px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.2s;
  font-size: 1.08rem;
}
.drawer-menu li.active,
.drawer-menu li:hover {
  background: #23232e;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 100vw;
    height: 56px;
    min-height: 0;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .logo {
    margin-bottom: 0;
    margin-right: 0;
    font-size: 1.1rem;
    text-align: left;
    flex: 1 1 auto;
    justify-content: flex-start;
    align-items: center;
    height: 56px;
    width: auto;
    display: flex;
  }
  .hamburger {
    display: inline-flex;
    height: 56px;
    align-items: center;
    margin-left: 0;
    margin-right: 8px;
    font-size: 2rem;
    cursor: pointer;
    color: #fff;
  }
  .menu {
    display: none;
  }
  /* drawer는 220px만 차지, 화면 전체 덮지 않음 */
  .drawer {
    width: 220px;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 2000;
    padding-top: 56px;
  }
}
</style>
