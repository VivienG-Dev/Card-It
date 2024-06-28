<script setup>
definePageMeta({
  layout: "public",
});

const route = useRoute();

const { passwordError, validatePassword } = useValidation();

const tokenId = route.params.tokenId;

const newPassword = ref("");
const confirmPassword = ref("");
const sendingError = ref("");
const sendingSuccess = ref("");
async function updateUserPassword() {
  sendingError.value = "";
  sendingSuccess.value = "";

  const updateUserPasswordApiUrl = `${import.meta.env.VITE_API_URL}/auth/forgot-password/${tokenId}`;
  const updateUserPasswordState = await $fetchApi(updateUserPasswordApiUrl, {
    method: "PATCH",
    body: JSON.stringify({ newPassword: newPassword.value, confirmPassword: confirmPassword.value }),
  });

  if (updateUserPasswordState.data) {
    sendingSuccess.value = "Password updated successfully, you may now login.";
  } else {
    sendingError.value = updateUserPasswordState?.error || "Failed to update password. Please try again.";
  }
}

const usePasswordVisibility = () => {
  const isVisible = ref(false);
  const toggleVisibility = () => {
    isVisible.value = !isVisible.value;
  };
  return { isVisible, toggleVisibility };
};
const { isVisible: isNewPasswordVisible, toggleVisibility: toggleNewPasswordVisibility } = usePasswordVisibility();
const { isVisible: isConfirmPasswordVisible, toggleVisibility: toggleConfirmPasswordVisibility } =
  usePasswordVisibility();
</script>

<template>
  <div class="flex flex-col items-center w-full space-y-4">
    <form @submit.prevent="updateUserPassword()" class="space-y-4 w-full sm:w-[450px]">
      <div class="flex flex-col space-y-2">
        <h1 class="text-2xl font-semibold">Change your password</h1>
        <p class="text-sm font-light">Please enter your new password below.</p>
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
        <label for="newPassword" class="text-sm font-light">New password</label>
        <div class="relative flex items-center">
          <input
            id="newPassword"
            :type="isNewPasswordVisible ? 'text' : 'password'"
            placeholder="New password"
            v-model="newPassword"
            @input="validatePassword(newPassword)"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{
              'border-red-500': passwordError,
            }"
          />
          <Icons
            @click="toggleNewPasswordVisibility()"
            svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
            :isType="isNewPasswordVisible ? 'eye' : 'eyeSlash'"
          />
        </div>
        <div class="text-red-500 text-xs pb-4 text-center h-2">
          {{ passwordError }}
        </div>

        <label for="confirmPassword" class="text-sm font-light">Confirm password</label>
        <div class="relative flex items-center">
          <input
            id="confirmPassword"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            placeholder="Confirm password"
            v-model="confirmPassword"
            @input="validatePassword(confirmPassword)"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{
              'border-red-500': newPassword !== confirmPassword,
            }"
          />
          <Icons
            @click="toggleConfirmPasswordVisibility()"
            svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
            :isType="isConfirmPasswordVisible ? 'eye' : 'eyeSlash'"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <Button name="Send" variant="confirm" />
      </div>
    </form>
  </div>
</template>
