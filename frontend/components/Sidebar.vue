<script setup>
const { links } = useUserNavigation();
</script>

<template>
  <div class="hidden sm:flex flex-col space-y-4">
    <nuxtLink
      v-for="link in links"
      :key="link.name"
      :to="link.path"
      :class="[
        'w-44 font-light text-base p-3 rounded-lg text-center hover:ring-2 ring-customPrimary ring-offset-2 ring-offset-blue-100 cursor-pointer',
        {
          'bg-white': $route.path !== link.path,
          'bg-customPrimary text-white': $route.path === link.path,
        },
      ]"
    >
      {{ link.name }}
    </nuxtLink>
  </div>
</template>
