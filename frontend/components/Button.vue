<script setup>
const props = defineProps({
  name: String,
  color: {
    type: String,
    default: "bg-black text-white",
  },
});
</script>

<template>
  <button class="w-full py-2 rounded-lg transition ease-in-out hover:-translate-y-1 duration-300 hover:shadow-lg" :class="color">
    {{ name }}
  </button>
</template>
