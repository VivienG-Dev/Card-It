<template>
  <div class="flex flex-col sm:flex-row space-x-0 sm:space-x-4 w-full mt-20 sm:mt-32">
    <Sidebar />
    <div class="bg-white w-full rounded-lg p-3 space-y-4">
      <slot />
    </div>
  </div>
</template>
