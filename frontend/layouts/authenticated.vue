<script setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="container max-w-screen-xl mx-auto px-4">
    <div>
      <div class="fixed top-5 right-0 left-0 z-20 w-full px-4">
        <div class="container max-w-screen-xl mx-auto">
          <Navbar />
        </div>
      </div>
    </div>

    <main class="flex relative">
      <BackgroundSVGs />
      <ClientOnly>
        <AuthenticatedContent v-if="authStore.isAuthenticated">
          <slot />
        </AuthenticatedContent>
        <UnauthenticatedContent v-else />
      </ClientOnly>
    </main>
    <Footer />
  </div>
</template>
