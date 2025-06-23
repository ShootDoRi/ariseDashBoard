<template>
  <header class="topbar">
    <input class="search" placeholder="Search" />
  </header>
</template>

<script setup>
// 상단바 컴포넌트
</script>

<style scoped>
.topbar {
  height: 56px;
  background: #181a20;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #23232e;
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
</style>
