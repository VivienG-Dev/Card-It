<script setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="container max-w-screen-xl mx-auto px-4">
    <div class="fixed top-5 right-0 left-0 z-20 w-full px-4">
      <div class="container max-w-screen-xl mx-auto">
        <Navbar />
      </div>
    </div>

    <main class="flex h-screen relative">
      <div class="svg-bg svg-bg-1"></div>
      <div class="svg-bg svg-bg-3"></div>
      <div class="svg-bg svg-bg-2"></div>
      <div class="svg-bg svg-bg-4"></div>
      <ClientOnly>
        <div
          v-if="authStore.isLoading"
          class="flex flex-col sm:flex-row space-x-0 sm:space-x-4 w-full mt-20 sm:mt-32"
        >
          <div
            class="bg-white w-full rounded-lg p-10 space-y-4 flex flex-col justify-center items-center"
          >
            <Icons svgClass="w-8 h-8" isType="locked" />
            <p class="text-center text-2xl font-medium">
              Loading, please wait while my free instance on Render.com
              restarts...
            </p>
          </div>
        </div>
        <div v-else class="flex space-x-4 w-full mt-32">
          <div
            class="flex justify-center items-center bg-white w-full rounded-lg p-3 space-y-4"
          >
            <slot />
          </div>
        </div>
      </ClientOnly>
    </main>
  </div>
</template>

<style scoped>
.svg-bg {
  position: absolute;
  z-index: -1;
  filter: blur(70px);
  transform: translate3d(0, 0, 0); /* Fix for Safari flickering */
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
