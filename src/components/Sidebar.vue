<template>
  <nav class="sidebar">
    <div class="logo">ARISE</div>
    <ul class="menu">
      <li class="active">Dashboard</li>
      <li>Members(개발중)</li>
      <li>Raid Report(개발중)</li>
      <li>Settings(개발중)</li>
    </ul>
  </nav>
</template>

<script setup>
// ARISE 스타일 사이드바
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
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 2px;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu li {
  padding: 16px 32px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.2s;
  font-size: 1.08rem;
}
.menu li.active,
.menu li:hover {
  background: #23232e;
}
@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
    min-width: 0;
    min-height: 0;
    height: 56px;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .logo {
    margin-bottom: 0;
    margin-right: 18px;
    font-size: 1.1rem;
    text-align: left;
    flex: none;
  }
  .menu {
    display: flex;
    flex-direction: row;
    gap: 0;
    margin-left: auto;
    align-items: center;
  }
  .menu li {
    padding: 8px 12px;
    margin-bottom: 0;
    font-size: 0.98rem;
    border-radius: 6px;
  }
}
</style>
