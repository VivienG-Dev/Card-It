<script setup>
const props = defineProps({
  isVisible: Boolean,
  confirmNameButton: String,
});

const emit = defineEmits(["confirm", "cancel"]);

function confirmAction() {
  emit("confirm");
}

function cancelAction() {
  emit("cancel");
}
</script>

<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-50 z-40">
      <transition name="scale">
        <div class="modal-content bg-white p-4 rounded-lg shadow-lg" v-if="isVisible">
          <slot name="content"></slot>
          <div class="flex justify-end mt-4 space-x-4">
            <button @click="confirmAction" class="bg-customPrimary hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-lg">
              {{ confirmNameButton ? confirmNameButton : "Confirm" }}
            </button>
            <button @click="cancelAction" class="font-light">Cancel</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style>
/* Fade transition for the backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale transition for the modal content */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.1s;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.1);
}
.scale-enter-to,
.scale-leave-from {
  transform: scale(1);
}
</style>
