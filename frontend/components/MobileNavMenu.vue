<script setup>
const authStore = useAuthStore();
const { links } = useUserNavigation();
const props = defineProps({
  isMenuOpen: Boolean,
});
const emit = defineEmits(["update:isMenuOpen"]);
const closeMenu = () => {
  emit("update:isMenuOpen");
};
</script>

<template>
  <div>
    <div v-if="isMenuOpen" class="absolute -right-3 mt-3 w-48 rounded-md shadow-lg bg-white z-50">
      <div v-if="authStore.isAuthenticated" class="py-1">
        <nuxt-link
          v-for="link in links"
          :key="link.name"
          :to="link.path"
          class="flex flex-col w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="closeMenu"
        >
          {{ link.name }}
        </nuxt-link>
        <button
          @click="authStore.logout, closeMenu"
          class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
