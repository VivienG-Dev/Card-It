<template>
  <div>
    <div class="svg-bg svg-bg-1"></div>
    <div class="svg-bg svg-bg-3"></div>
    <div class="svg-bg svg-bg-2"></div>
    <div class="svg-bg svg-bg-4"></div>
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
}

.svg-bg-2 {
  top: 13%;
  left: 25%;
  background-image: url("/Vector-2.svg");
}

.svg-bg-3 {
  top: 10%;
  left: 30%;
  background-image: url("/Vector-3.svg");
}

.svg-bg-4 {
  top: 10%;
  left: 30%;
  background-image: url("/Vector-4.svg");
}
</style>
