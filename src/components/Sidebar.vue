<template>
  <nav class="sidebar" :class="{ open: isOpen }">
    <div class="logo">
      <span class="hamburger" @click="toggleSidebar" v-if="isMobile">☰</span>
      <span v-else>COMMUNITY OPS</span>
    </div>
    <div class="sidebar-search">
      <input
        class="search"
        placeholder="Search"
        :value="searchKeyword"
        @input="onInput"
      />
    </div>
    <transition name="slide">
      <div class="drawer" v-if="isMobile && isOpen">
        <button class="drawer-close" @click="closeSidebar">✕</button>
        <ul class="drawer-menu">
          <li
            v-for="menu in menuList"
            :key="menu.name"
            @click="menuActor(menu.path)"
            :class="{ active: route.path === menu.path }"
          >
            {{ menu.name }}
          </li>
        </ul>
      </div>
    </transition>
    <ul class="menu" v-if="!isMobile">
      <li
        v-for="menu in menuList"
        :key="menu.name"
        @click="menuActor(menu.path)"
        :class="{ active: route.path === menu.path }"
      >
        {{ menu.name }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAriseStore } from "../store/arise";
import { useGalleryStore } from "../store/gallery";
import { useNtrStore } from "../store/ntr";
import { useAllStore } from "../store/all";
import { useIsMobile } from "../composables/useIsMobile";

const isMobile = useIsMobile();
const ariseStore = useAriseStore();
const galleryStore = useGalleryStore();
const ntrStore = useNtrStore();
const allStore = useAllStore();
const isOpen = ref(false);
const router = useRouter();
const route = useRoute();

function getRouteStore(path) {
  if (path.startsWith("/community-beta") || path.startsWith("/arise")) {
    return ariseStore;
  }
  if (path.startsWith("/community-gamma") || path.startsWith("/ntr")) {
    return ntrStore;
  }
  if (path.startsWith("/ranking") || path.startsWith("/all")) {
    return allStore;
  }
  return galleryStore;
}

const searchKeyword = computed({
  get() {
    return getRouteStore(route.path).searchState.keyword;
  },
  set(val) {
    getRouteStore(route.path).searchState.keyword = val;
  },
});

const menuList = reactive([
  { name: "Community Alpha", path: "/community-alpha" },
  { name: "Community Beta", path: "/community-beta" },
  { name: "Community Gamma", path: "/community-gamma" },
  { name: "Overall Ranking", path: "/ranking" },
]);

async function menuActor(path) {
  try {
    await router.push(path);
  } finally {
    isOpen.value = false;
  }
}

function toggleSidebar() {
  isOpen.value = !isOpen.value;
}
function closeSidebar() {
  isOpen.value = false;
}
function onInput(e) {
  searchKeyword.value = e.target.value;
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #181a20;
  color: #fff;
  min-height: 100vh;
  padding: 32px 0 0 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.2s;
  z-index: 100;
}
li {
  cursor: pointer;
}
.logo {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: 1px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-search {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px 16px 16px;
}
.search {
  background: #23232e;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  color: #fff;
  font-size: 1rem;
  width: 100%;
  outline: none;
  box-sizing: border-box;
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
.menu li,
.drawer-menu li {
  text-align: left;
}
.menu li {
  padding: 14px 18px;
}
.menu li.active,
.menu li:hover {
  background: #23232e;
}

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

@media (max-width: 768px) {
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
    max-width: fit-content;
    display: flex;
  }
  .sidebar-search {
    flex: 1 1 auto;
    padding: 0 8px;
    height: 56px;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .search {
    width: 100%;
    min-width: 0;
    max-width: 340px;
    font-size: 1rem;
    padding: 8px 12px;
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
