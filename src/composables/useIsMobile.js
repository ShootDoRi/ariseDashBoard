import { ref, onMounted, onUnmounted } from "vue";

export function useIsMobile(breakpoint = 768) {
  const isMobile = ref(false);

  function handleResize() {
    isMobile.value = window.innerWidth <= breakpoint;
  }

  onMounted(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return isMobile;
}
