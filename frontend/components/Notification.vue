<script setup>
const props = defineProps({
  name: String,
  message: String,
  backgroundColor: {
    type: String,
    default: "bg-black text-white",
  },
  duration: {
    type: Number,
    default: 10000,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const progress = ref(100);
const timer = ref();
const localIsVisible = ref(props.isVisible);

const startTimer = () => {
  progress.value = 100;
  timer.value = setInterval(() => {
    progress.value -= 1;
    if (progress.value <= 0) {
      clearInterval(timer.value);
      localIsVisible.value = false;
    }
  }, props.duration / 100);
};

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      localIsVisible.value = true;
      startTimer();
    } else {
      clearInterval(timer.value);
      localIsVisible.value = false;
    }
  }
);
</script>

<template>
  <div
    class="flex flex-col justify-between h-20 max-h-28 w-72 max-w-96 rounded-md shadow-md fixed bottom-5 right-5 md:bottom-20 md:right-32 z-50 bg-white border border-gray-200 transition-all duration-500 ease-in-out transform"
    :class="[backgroundColor, localIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full']"
  >
    <div />
    <div class="flex justify-center items-center">
      <div>
        <h2 class="">{{ name }}</h2>
        <p class="text-sm text-red-700">{{ message }}</p>
      </div>
    </div>
    <div class="h-1 w-full bg-gray-200 rounded-tl-none rounded-tr-none rounded-b-md overflow-hidden">
      <div class="h-full w-full bg-green-500" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>
