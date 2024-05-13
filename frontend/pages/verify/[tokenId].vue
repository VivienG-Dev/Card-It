<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tokenId = ref(route.params.tokenId);
const loading = ref(false);
const error = ref(null);
const verified = ref(false);

function emailVerifyWithToken(url) {
  loading.value = true;
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const errorMessage = body.error?.message || "Unknown error occurred";
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then((_) => {
      verified.value = true;
      localStorage.setItem("emailVerified", true);
      // navigateTo("/");
    })
    .catch((err) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  emailVerifyWithToken(
    `${import.meta.env.VITE_API_URL}/auth/verify/${tokenId.value}`
  );
});
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div class="flex flex-col items-center">
      <h1>Email Verification</h1>
      <p v-if="loading">Verifying email...</p>
      <p v-if="verified">
        Your email has been successfully verified. You may now log in.
      </p>
      <p v-else>{{ errorMessage }}</p>
    </div>
  </div>
</template>
