<script setup>
definePageMeta({
  layout: "public",
});

const sendingError = ref("");
const sendingSuccess = ref("");
const loading = ref(false);
const lastEmailSentTime = ref(0);
function sendEmailToResetUserPassword(email) {
  const currentTime = Date.now();

  // 600000 ms = 10 minutes
  if (currentTime - lastEmailSentTime.value < 600000) {
    sendingError.value =
      "You cannot send another email before 1 minute has passed.";
    return;
  }
  lastEmailSentTime.value = currentTime;

  sendingError.value = "";
  sendingSuccess.value = "";
  loading.value = true;
  fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
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
      sendingSuccess.value =
        "Email sent successfully. Please check your email.";
      // navigateTo("/");
    })
    .catch((err) => {
      sendingError.value =
        err.message || "Failed to send email. Please try again.";
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="flex flex-col items-center w-full space-y-4">
    <form
      @submit.prevent="sendEmailToResetUserPassword(email)"
      class="space-y-4 w-full sm:w-[450px]"
    >
      <div class="flex flex-col space-y-2">
        <h1 class="text-2xl font-semibold">Forgot Password</h1>
        <p class="text-sm font-light">
          If you forgot your password, please enter your email address. We will
          send you an email to reset your password.
        </p>
        <div
          class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
          :class="{
            'bg-red-100 text-red-500': sendingError,
            'bg-green-100 text-green-500': sendingSuccess,
          }"
        >
          {{ sendingError || sendingSuccess }}
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <label for="email" class="text-sm font-light">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          v-model="email"
          placeholder="Your email"
          class="border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div class="flex flex-col">
        <Button name="Send" color="bg-customPrimary text-white" />
      </div>
    </form>
  </div>
</template>
