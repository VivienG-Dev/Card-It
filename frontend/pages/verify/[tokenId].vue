<script setup>
definePageMeta({
  layout: "public",
});

import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tokenId = ref(route.params.tokenId);
const verified = ref(false);
const error = ref(null);

const emailVerifyApiUrl = `${import.meta.env.VITE_API_URL}/auth/verify/${tokenId.value}`;
const emailVerifyState = useApiFetch(emailVerifyApiUrl);

watch(emailVerifyState, (newState) => {
  if (newState.data) {
    verified.value = true;
  } else if (newState.error) {
    error.value = newState.error;
  }
});
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="flex flex-col items-center">
      <h1>Email Verification</h1>
      <p v-if="emailVerifyState.loading">Verifying email...</p>
      <p v-if="verified">
        Your email has been successfully verified. You may now log in.
      </p>
      <p v-else>{{ emailVerifyState.error }}</p>
    </div>
  </div>
</template>
