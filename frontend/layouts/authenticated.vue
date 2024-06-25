<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const authStore = useAuthStore();

const username = route.params.username;

const links = [
  { name: "Dashboard", path: `/users/${username}` },
  { name: "Profile", path: `/users/${username}/profile` },
  { name: "Favorites", path: `/users/${username}/favorites` },
];
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
        <div
          v-if="authStore.isAuthenticated"
          class="flex flex-col sm:flex-row space-x-0 sm:space-x-4 w-full mt-20 sm:mt-32"
        >
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
          <div class="bg-white w-full rounded-lg p-3 space-y-4">
            <slot />
          </div>
        </div>
        <div v-else class="flex space-x-4 w-full mt-32">
          <div class="bg-white w-full h-80 rounded-lg p-3 space-y-4 flex flex-col justify-center items-center">
            <Icons svgClass="w-8 h-8" isType="locked" />
            <p v-if="authStore.isLoading" class="text-center text-2xl font-medium">
              Loading, please wait while my free account from render.com restarts...
            </p>
            <p v-else class="text-center text-2xl font-medium">You need to be logged in to view this page.</p>
          </div>
        </div>
      </ClientOnly>
    </main>
    <Footer />
  </div>
</template>
