<script setup>
definePageMeta({
  layout: false,
});

import supabase from "../config/supabaseClient";
// console.log(supabase);

const expandDiv = ref(false);
</script>

<template>
  <div class="container max-w-screen-xl mx-auto">
    <div class="fixed top-5 right-0 left-0 z-20 w-full">
      <div class="container max-w-screen-xl mx-auto px-4">
        <Navbar />
      </div>
    </div>

    <header class="flex items-center h-screen relative">
      <div class="svg-bg svg-bg-1"></div>
      <div class="svg-bg svg-bg-3"></div>
      <div class="svg-bg svg-bg-2"></div>
      <div class="svg-bg svg-bg-4"></div>
      <div
        class="flex flex-col sm:flex-row justify-center items-center w-full h-80 px-0 sm:px-10 md:px-20 lg:px-32"
      >
        <div
          class="w-100 sm:w-1/2 flex flex-col justify-center items-start mb-10"
        >
          <h1 class="text-4xl sm:text-5xl font-bold mb-5">Card-It</h1>
          <h2 class="text-2xl sm:text-3xl font-bold">Create your cards</h2>
          <h2 class="text-2xl sm:text-3xl font-bold">Test your memory</h2>
          <h2 class="text-2xl sm:text-3xl font-bold">Remember it!</h2>

          <button
            class="flex items-center text-base font-light mt-10"
            @mouseover="expandDiv = true"
            @mouseleave="expandDiv = false"
          >
            How to create a card?
            <Icons svgClass="w-4 h-4 ml-1" isType="arrowRight" />
          </button>
          <div
            class="h-1 bg-black rounded-lg transition-all ease-in-out duration-300"
            :class="expandDiv ? 'w-40' : 'w-20'"
          ></div>
        </div>

        <div class="w-100 sm:w-1/2 flex justify-center items-center relative">
          <div
            class="w-60 h-80 bg-white border-4 border-orange-400 rounded-lg absolute right-0 sm:right-0 flex justify-center items-center p-4 float-animation"
          >
            <p>
              Keep it simple, stupid (KISS) is a design principle which states
              that designs and/or systems should be as simple as possible
            </p>
          </div>
          <div
            class="w-60 h-80 bg-orange-400 border-slate-900 rounded-lg transform rotate-3 sm:absolute sm:right-12 sm:-bottom-36 p-4 flex flex-col justify-between text-white float-animation-rotate"
          >
            <div class="w-full">
              <div class="flex justify-between">
                <p class="font-thin">Web development</p>
                <span>
                  <Icons svgClass="w-6 h-6 hover:fill-white" isType="star" />
                </span>
              </div>
            </div>
            <p class="self-center font-bold">What is KISS?</p>
            <div class="w-full" />
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
@keyframes floatXYRotate {
  0%,
  100% {
    transform: translate(0, 0) rotate(3deg);
  }
  25% {
    transform: translate(5px, -10px) rotate(3deg);
  }
  50% {
    transform: translate(-5px, 5px) rotate(3deg);
  }
  75% {
    transform: translate(5px, 5px) rotate(3deg);
  }
}

@keyframes floatXY {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(5px, -10px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  75% {
    transform: translate(5px, 5px);
  }
}

.float-animation-rotate {
  animation: floatXYRotate 9s ease-in-out infinite;
}

.float-animation {
  animation: floatXY 9s ease-in-out infinite;
  animation-delay: 0.5s;
}

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

@keyframes one {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(-100px, 70px);
  }
  50% {
    transform: translate(20px, 150px);
  }
  75% {
    transform: translate(50px, 100px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
@keyframes two {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(-100px, 70px);
  }
  50% {
    transform: translate(20px, 150px);
  }
  75% {
    transform: translate(50px, 100px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>
