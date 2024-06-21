<script setup>
const props = defineProps({
  name: String,
  variant: {
    type: String,
    default: "ghost",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const variantClasses = {
  ghost:
    "w-full px-2 py-1 rounded-lg transition ease-in-out duration-300 hover:bg-slate-200 bg-white text-slate-950 flex justify-center items-center space-x-2",
  text: "px-2 py-1 rounded-lg transition ease-in-out duration-300 hover:bg-slate-200 bg-white text-slate-950",
  confirm:
    "w-full px-2 py-1 rounded-lg transition ease-in-out duration-300 bg-customPrimary hover:bg-customPrimaryDark text-white flex justify-center items-center space-x-2",
  action:
    "px-2 py-1 rounded-lg transition ease-in-out duration-300 bg-customPrimary hover:bg-customPrimaryDark text-white flex justify-center items-center space-x-2",
  delete:
    "px-2 py-1 rounded-lg transition ease-in-out duration-300 hover:bg-red-500 bg-white text-red-600 hover:text-white flex justify-center items-center space-x-2",
  auth: "w-full py-1 rounded-lg transition ease-in-out duration-300 bg-slate-950 hover:bg-slate-800 text-white flex justify-center items-center space-x-2",
  demo: "px-2 py-1 rounded-lg transition ease-in-out duration-300 bg-slate-950 hover:bg-slate-800 text-white flex justify-center items-center space-x-2",
};
</script>

<template>
  <button :class="variantClasses[variant]" :disabled="isLoading">
    <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
        stroke-dasharray="31.4"
        stroke-dashoffset="31.4"
      ></circle>
    </svg>
    {{ isLoading ? "Loading..." : name }}
  </button>
</template>
