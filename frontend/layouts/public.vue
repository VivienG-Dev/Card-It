<template>
  <div class="container max-w-screen-xl mx-auto px-4">
    <div class="fixed top-5 right-0 left-0 z-20 w-full px-4">
      <div class="container max-w-screen-xl mx-auto">
        <Navbar />
      </div>
    </div>

    <main class="flex h-screen relative">
      <BackgroundSVGs />
      <ClientOnly>
        <div class="flex space-x-4 w-full mt-32">
          <div class="bg-white w-full h-96 rounded-lg p-3 space-y-4 flex flex-col justify-center items-center">
            <slot />
          </div>
        </div>
      </ClientOnly>
    </main>
  </div>
</template>
