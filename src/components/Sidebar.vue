<template>
  <nav class="sidebar" :class="{ open: isOpen }">
    <div class="logo">
      <span class="hamburger" @click="toggleSidebar" v-if="isMobile">☰</span>
      <span v-else>DASH BOARD</span>
    </div>
    <!-- 서치바를 사이드바 상단에 추가 -->
    <div class="sidebar-search">
      <input class="search" placeholder="Search" :value="searchKeyword" @input="onInput" />
    </div>
    <transition name="slide">
      <div class="drawer" v-if="isMobile && isOpen">
        <button class="drawer-close" @click="closeSidebar">✕</button>
        <ul class="drawer-menu">
          <!-- <li>나혼렙갤러리(개발중)</li>
          <li class="active">ARISE</li>
          <li>NTR(개발중)</li>
          <li>Settings(개발중)</li> -->
          <li v-for="menu in menuList" :key="menu.name" @click="menuActor(menu.path)" :class="{ active: route.path === menu.path }">
            {{ menu.name }}
          </li>
        </ul>
      </div>
    </transition>
    <ul class="menu" v-if="!isMobile">
      <!-- <li>나혼렙갤러리(개발중)</li>
      <li class="active">ARISE</li>
      <li>NTR(개발중)</li>
      <li>Settings(개발중)</li> -->
      <li v-for="menu in menuList" :key="menu.name" @click="menuActor(menu.path)" :class="{ active: route.path === menu.path }">
        {{ menu.name }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // 추가
import { useAriseStore } from "../store/arise";
import { useGalleryStore } from "../store/gallery";
import { useNtrStore } from "../store/ntr"; // NTR 스토어 추가
import { useIsMobile } from "../composables/useIsMobile";
const isMobile = useIsMobile();
const ariseStore = useAriseStore();
const galleryStore = useGalleryStore();
const ntrStore = useNtrStore(); // NTR 스토어 인스턴스 생성

const isOpen = ref(false);
const isTabletOrLess = ref(false);
const router = useRouter(); // 추가
const route = useRoute();

// 현재 경로에 따라 검색 상태를 반환
const searchKeyword = computed({
  get() {
    if (route.path.startsWith("/gallery")) return galleryStore.searchState.keyword;
    if (route.path.startsWith("/arise")) return ariseStore.searchState.keyword;
    if (route.path.startsWith("/ntr")) return ntrStore.searchState.keyword; // NTR 경로에 대한 검색 상태
    return "";
  },
  set(val) {
    if (route.path.startsWith("/gallery")) galleryStore.searchState.keyword = val;
    else if (route.path.startsWith("/arise")) ariseStore.searchState.keyword = val;
    else if (route.path.startsWith("/ntr")) ntrStore.searchState.keyword = val; // NTR 경로에 대한 검색 상태 설정
    else return;
  },
});

const menuList = reactive([
  { name: "나혼렙갤러리", path: "/gallery" },
  { name: "ARISE", path: "/arise" },
  { name: "NTR", path: "/ntr" },
  { name: "Settings(개발중)", path: "/settings" },
]);

async function menuActor(path) {
  try {
    await router.push(path);
    isOpen.value = false; // 모바일에서 메뉴 클릭 시 사이드바 닫기
  } catch (error) {
    isOpen.value = false; // 모바일에서 메뉴 클릭 시 사이드바 닫기
  }
}

console.log("route ==> ", route);

/* function handleResize() {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) isOpen.value = false;
} */

function toggleSidebar() {
  isOpen.value = !isOpen.value;
}
function closeSidebar() {
  isOpen.value = false;
}
function onInput(e) {
  searchKeyword.value = e.target.value;
}

onMounted(() => {
  /* handleResize();
  window.addEventListener("resize", handleResize); */
});
onUnmounted(() => {
  //window.removeEventListener("resize", handleResize);
});
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
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: 2px;
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
    //width: auto;
    max-width: fit-content; /* 추가: 내용에 맞게 너비 조정 */
    display: flex;
  }
  .sidebar-search {
    flex: 1 1 auto;
    padding: 0 8px;
    height: 56px;
    align-items: center;
    display: flex;
    justify-content: center; /* 추가: 가운데 정렬 */
  }
  .search {
    width: 100%;
    min-width: 0;
    max-width: 340px; /* 추가: 너무 넓어지지 않게 */
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
