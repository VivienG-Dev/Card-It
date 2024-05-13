<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "bg-gray-300",
  },
  link: {
    type: String,
    default: "",
  },
});

const isHovered = ref(false);
</script>

<template>
  <div class="relative w-36 h-48 sm:w-40 sm:h-52">
    <nuxt-link :to="link" class="relative flex justify-center items-center w-full h-full" @mouseover="isHovered = true"
      @mouseleave="isHovered = false">
      <div :style="{ backgroundColor: color }"
        class="w-28 h-44 sm:w-32 sm:h-48 rounded-lg p-2 text-white absolute transition-all duration-300 ease-in-out"
        :class="isHovered ? '-top-4' : '-top-2'"></div>
      <div :style="{ backgroundColor: color }"
        class="w-32 h-44 sm:w-36 sm:h-48 rounded-lg p-2 border-t border-white text-white absolute transition-all duration-300 ease-in-out"
        :class="isHovered ? '-top-2' : '-top-1'"></div>
      <div :style="{ backgroundColor: color }"
        class="flex justify-center items-center w-full h-full rounded-lg p-2 border-t border-white text-white absolute">
        <p class="font-medium text-center">{{ title }}</p>
      </div>
    </nuxt-link>
  </div>
</template>

<style scoped></style>
