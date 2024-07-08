<script setup>
const { isModalOpen, currentModalType, showDemoLogin, closeModal } = useAuthModal();
const { authAction, isLoading, errorResponse, successfulResponse, demoSignInError } = useAuthAction();
const { usernameError, emailError, passwordError, validateUsername, validateEmail, validatePassword } = useValidation();

const username = ref("");
const email = ref("");
const password = ref("");
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => (isPasswordVisible.value = !isPasswordVisible.value);

const handleSubmit = async () => {
  if (passwordError.value || emailError.value || (usernameError.value && currentModalType.value === "register")) {
    errorResponse.value = "Please correct the errors in the form.";
    return;
  }

  if (!email.value || !password.value || (currentModalType.value === "register" && !username.value)) {
    errorResponse.value = "Please fill in all required fields.";
    return;
  }

  errorResponse.value = "";

  try {
    await authAction(currentModalType.value === "register" ? "register" : "login", {
      username: username.value.toLowerCase(),
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    console.error("Authentication failed:", error);
  }
};

watch(successfulResponse, async (newValue) => {
  if (newValue) {
    if (currentModalType.value === "login") {
      setTimeout(() => {
        closeModal();
      }, 200);
    }
  }
});

const goToForgotPassword = () => {
  window.location.href = "/forgot-password";
};
</script>

<template>
  <dialog :open="isModalOpen" class="z-50">
    <!-- Overlay -->
    <div class="fixed backdrop-blur-sm backdrop-brightness-50 inset-0"></div>

    <!-- Modal content -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg py-3 px-14 w-[500px] h-[500px] mx-auto relative">
        <Icons @click="closeModal" svgClass="w-7 h-7 absolute top-2 right-2" isType="close" />

        <!-- Register/Login Form -->
        <div v-if="currentModalType === 'register' || currentModalType === 'login'" class="flex flex-col">
          <h2 class="text-lg text-center font-semibold text-gray-800">
            {{ currentModalType === "register" ? "Create a new account" : "Sign-In" }}
          </h2>
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': errorResponse,
              'bg-green-100 text-green-500': successfulResponse,
            }"
          >
            {{ errorResponse || successfulResponse }}
          </div>
          <form @submit.prevent="handleSubmit()" class="space-y-4">
            <!-- Username input -->
            <div v-if="currentModalType === 'register'">
              <label for="Username" class="font-normal text-sm mb-10">Username:</label>
              <input
                type="text"
                placeholder="Username"
                name="Username"
                v-model="username"
                @input="validateUsername(username)"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{
                  'border-red-500': usernameError || (errorResponse && username === ''),
                }"
              />
              <div class="text-red-500 text-xs text-center h-2">{{ usernameError }}</div>
            </div>
            <!-- Email input -->
            <div>
              <label for="Email" class="font-normal text-sm">Email:</label>
              <input
                type="email"
                placeholder="Email"
                name="Email"
                v-model="email"
                @input="validateEmail(email)"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{
                  'border-red-500': emailError || (errorResponse && email === ''),
                }"
              />
              <div class="text-red-500 text-xs text-center h-2">{{ emailError }}</div>
            </div>
            <!-- Password input -->
            <div>
              <label for="Password" class="font-normal text-sm">Password:</label>
              <div class="relative flex items-center">
                <input
                  id="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  placeholder="Password"
                  v-model="password"
                  @input="currentModalType === 'register' ? validatePassword(password) : null"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500': passwordError || (errorResponse && password === ''),
                  }"
                />
                <Icons
                  @click="togglePasswordVisibility"
                  svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
                  :isType="isPasswordVisible ? 'eye' : 'eyeSlash'"
                />
              </div>
              <div class="text-red-500 text-xs text-center h-4">{{ passwordError }}</div>
            </div>
            <Button
              :name="currentModalType === 'register' ? 'Register' : 'Sign-In'"
              variant="auth"
              :isLoading="isLoading"
            />
            <div class="flex justify-center">
              <div class="w-2/3 h-px bg-black rounded-lg"></div>
            </div>
            <p class="text-sm text-center font-extralight">
              {{ currentModalType === "register" ? "Already have an account?" : "Don't have an account?" }}
              <nuxt-link
                :to="currentModalType === 'register' ? '/?modal=login' : '/?modal=register'"
                class="underline underline-offset-2"
                >{{ currentModalType === "register" ? "Register" : "Sign-Up" }}</nuxt-link
              >
            </p>
            <p v-if="currentModalType === 'login'" class="text-sm text-center font-extralight">
              <a @click.prevent="goToForgotPassword" class="underline underline-offset-2 cursor-pointer"
                >Forgot password</a
              >
            </p>
          </form>
        </div>

        <!-- Demo Account -->
        <div v-if="showDemoLogin" class="flex flex-col items-center justify-center">
          <h2 class="text-lg text-center font-semibold text-gray-800">Demo Account</h2>
          <div class="flex justify-center items-center w-full h-96 rounded-lg text-base">
            <p v-if="demoSignInError">{{ demoSignInError }}</p>
            <p v-else>Loading, please wait while my free account from render.com restarts...</p>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
