<script setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="flex space-x-4 w-full mt-32">
    <div class="bg-white w-full h-80 rounded-lg p-3 space-y-4 flex flex-col justify-center items-center">
      <Icons svgClass="w-8 h-8" isType="locked" />
      <p v-if="authStore.isLoading" class="text-center text-2xl font-medium">
        Loading, please wait while my free account from render.com restarts...
      </p>
      <p v-else class="text-center text-2xl font-medium">You need to be logged in to view this page.</p>
    </div>
  </div>
</template>
