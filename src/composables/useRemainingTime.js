import { ref, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function useRemainingTime(endDate) {
  const remainingTime = ref("");

  function updateRemainingTime() {
    const now = dayjs();
    const endDateObj = dayjs(endDate);
    let diff = endDateObj.diff(now);

    if (diff < 0) {
      remainingTime.value = "종료";
      return;
    }

    const duration = dayjs.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    remainingTime.value = `${days}일 ${hours}시 ${minutes}분 ${seconds}초`;
  }

  let timer;

  onMounted(() => {
    updateRemainingTime();
    timer = setInterval(updateRemainingTime, 1000);
  });

  onUnmounted(() => {
    clearInterval(timer);
  });

  return { remainingTime };
}
