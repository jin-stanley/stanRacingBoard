import { ref, computed, onMounted, onUnmounted } from 'vue'
import { formatCountdown, getCountdownSeconds, getRaceStatus, getCountdownClass } from '@/utils/time'

export function useCountdown(startTimeSeconds: number) {
  const countdown = ref(0)
  let timer: number | null = null

  const status = computed(() => getRaceStatus(startTimeSeconds))
  const isFinished = computed(() => status.value === 'finished')
  const countdownClass = computed(() => getCountdownClass(countdown.value))

  const countdownText = computed(() => {
    if (isFinished.value) return 'Closed'
    return formatCountdown(countdown.value)
  })

  function updateCountdown() {
    countdown.value = getCountdownSeconds(startTimeSeconds)

    // Clear existing timer
    if (timer !== null) {
      clearInterval(timer)
    }

    // Adjust update frequency based on countdown
    // Only update every second if under 5 minutes
    if (Math.abs(countdown.value) < 300) {
      timer = window.setInterval(updateCountdown, 1000)
    } else {
      // Update every 30 seconds for longer countdowns
      timer = window.setInterval(updateCountdown, 30000)
    }
  }

  onMounted(() => {
    updateCountdown()
  })

  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer)
    }
  })

  return {
    countdown,
    countdownText,
    countdownClass,
    status,
    isFinished
  }
}
