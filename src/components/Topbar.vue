<template>
  <header class="topbar">
    <input
      class="search"
      placeholder="Search"
      :value="commonStore.searchState.keyword"
      @input="onInput"
    />
  </header>
</template>

<script setup>
import { useAriseStore } from "../store/arise";
const commonStore = useAriseStore();

function onInput(e) {
  commonStore.searchState.keyword = e.target.value;
}
</script>

<style scoped>
/* .topbar {
  height: 56px;
  background: #181a20;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #23232e;
} */
/* Topbar.vue */
/* .topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 56px;
  background: #181a20;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #23232e;
  z-index: 2; /* drawer보다 높게!
} */
.topbar {
  position: fixed;
  top: 0;
  left: 200px; /* PC에서만 sidebar만큼 띄움 */
  width: calc(100vw - 200px);
  height: 56px;
  background: #181a20;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #23232e;
  z-index: 2001;
  box-sizing: border-box;
  padding-left: 0;
}
.search {
  background: #23232e;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  color: #fff;
  font-size: 1rem;
  width: 340px;
  outline: none;
}
@media (max-width: 1024px) {
  .topbar {
    left: 0;
    width: 100vw;
    padding-left: 0;
  }
}
</style>
