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
    <div class="fixed top-5 right-0 left-0 z-20 w-full px-4">
      <div class="container max-w-screen-xl mx-auto">
        <Navbar />
      </div>
    </div>

    <main class="flex relative">
      <div class="svg-bg svg-bg-1"></div>
      <div class="svg-bg svg-bg-3"></div>
      <div class="svg-bg svg-bg-2"></div>
      <div class="svg-bg svg-bg-4"></div>
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
          <div
            class="bg-white w-full h-52 rounded-lg p-3 space-y-4 flex flex-col justify-center items-center"
          >
            <Icons svgClass="w-8 h-8" isType="locked" />
            <p class="text-center text-2xl font-bold">
              You need to be logged in to view this page.
            </p>
          </div>
        </div>
      </ClientOnly>
    </main>
    <div class="flex justify-center mt-4 bg-white rounded-lg p-4">
      <p>
        Made with <span class="text-red-700">love</span> by
        <a
          href="https://www.vivieng.com/"
          class="text-customPrimary hover:underline decoration-customPrimary"
          >VivienG</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.svg-bg {
  position: absolute;
  z-index: -1;
  filter: blur(70px);
  transform: translate3d(0, 0, 0);
  /* Fix for Safari flickering */
  background-repeat: no-repeat;
  width: 70%;
  height: 60%;
  will-change: filter;
}

.svg-bg-1 {
  top: 20%;
  left: 0%;
  background-image: url("/Vector-1.svg");
  /* animation: one 10s infinite; */
}

.svg-bg-2 {
  top: 13%;
  left: 25%;
  background-image: url("/Vector-2.svg");
  /* animation: two 10s infinite delay(0.5s); */
}

.svg-bg-3 {
  top: 10%;
  left: 30%;
  background-image: url("/Vector-3.svg");
  /* animation: one 10s infinite; */
}

.svg-bg-4 {
  top: 10%;
  left: 30%;
  background-image: url("/Vector-4.svg");
  /* animation: two 10s infinite delay(0.5s); */
}

/* .router-link-exact-active {
  background-color: #90c0f7;
  color: #fff;
} */
</style>
