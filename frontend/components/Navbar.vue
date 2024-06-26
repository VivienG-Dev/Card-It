<script setup>
const authStore = useAuthStore();

const { isMenuOpen, toggleMenu } = useMobileNavigation();
const { openModal } = useAuthModal();
const { goToDemoAccount, isLoading } = useAuthAction();

const username = ref("");
onMounted(() => {
  username.value = localStorage.getItem("username") || authStore.user.username;
});
</script>

<template>
  <div>
    <nav class="flex items-center justify-between bg-white shadow h-10 rounded-lg py-2 px-4">
      <nuxt-link to="/">Card-It</nuxt-link>
      <ClientOnly>
        <div class="relative">
          <div v-if="authStore.isAuthenticated" class="flex space-x-4 space-y-1 font-light">
            <button @click="toggleMenu()" class="focus:outline-none flex sm:hidden">
              <Icons :isType="isMenuOpen ? 'closeMenu' : 'menu'" svgClass="w-7 h-7" />
            </button>
            <div class="hidden sm:flex space-x-4">
              <nuxt-link :to="`/users/${username}`">Dashboard</nuxt-link>
            </div>
            <button class="hidden sm:flex" @click="authStore.logout">Logout</button>
          </div>
          <div v-else class="space-x-1 sm:space-x-2 font-light flex">
            <Button @click="goToDemoAccount" name="Demo Account" variant="demo" :isLoading="isLoading" />
            <Button @click="openModal('register')" name="Register" variant="text" />
            <Button @click="openModal('login')" name="Login" variant="text" />
          </div>
          <MobileNavMenu />
        </div>
      </ClientOnly>
    </nav>
    <AuthModal />
  </div>
</template>

<style scoped>
.line {
  width: 20px;
  height: 2px;
  background-color: black;
  transition: all 0.3s;
}
</style>
