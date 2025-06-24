<template>
  <div class="dialog-backdrop" :class="{ active: commonStore.modalState.isOpen }" @click.self="closeDialog">
    <div class="dialog" :class="{ active: commonStore.modalState.isOpen }">
      <h3>유저 상세 정보</h3>
      <ul>
        <li v-for="(val, key) in userData" :key="key">
          <strong>{{ key }}:</strong> {{ val }}
        </li>
      </ul>
      <button @click="closeDialog">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCommonStore } from "../store/common";
const commonStore = useCommonStore();

function closeDialog() {
  commonStore.modalState.isOpen = false;
  commonStore.modalState.user = null; // 유저 정보 초기화
}

const userData = computed(() => {
  if (!commonStore.modalState?.userData) return false;
  const { userData } = commonStore.modalState;
  return {
    nick: userData["인게임_닉"],
    tag: userData["태그"],
    gal: userData["갤닉"],
    pos: userData["직위"],
    raid_score: userData["길드레이드_점수"],
    rage_count: userData["격노"],
    rank: userData["Rank"],
  };
});
</script>

<style scoped lang="scss">
.dialog-backdrop {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: background 0.25s, opacity 0.25s;
  .dialog {
    transform: scale(0.85);
    opacity: 0;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
    pointer-events: none;
  }
  &.active {
    background: rgba(0, 0, 0, 0.45);
    opacity: 1;
    pointer-events: auto;
    .dialog {
      transform: scale(1);
      opacity: 1;
      pointer-events: auto;
    }
  }
}
.dialog {
  background: #23232e;
  color: #fff;
  border-radius: 12px;
  padding: 24px 18px;
  min-width: 260px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}
.dialog button {
  margin-top: 18px;
  background: #4fd1c5;
  color: #23232e;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
