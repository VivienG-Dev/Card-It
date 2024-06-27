<script setup>
const { isModalOpen, showRegisterForm, showDemoLogin, closeModal } = useAuthModal();
const { authAction, isLoading, errorResponse, successfulResponse, demoSignInError } = useAuthAction();
const { usernameError, emailError, passwordError, validateUsername, validateEmail, validatePassword } = useValidation();

const username = ref("");
const email = ref("");
const password = ref("");
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => (isPasswordVisible.value = !isPasswordVisible.value);
</script>

<template>
  <dialog :open="isModalOpen" class="z-50">
    <!-- Overlay -->
    <div class="fixed backdrop-blur-sm backdrop-brightness-50 inset-0"></div>

    <!-- Modal content -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg py-3 px-14 w-[500px] h-[500px] mx-auto relative">
        <Icons @click="closeModal" svgClass="w-7 h-7 absolute top-2 right-2" isType="close" />

        <!-- Register Form -->
        <div v-if="showRegisterForm" class="flex flex-col">
          <h2 class="text-lg text-center font-semibold text-gray-800">Create a new account</h2>
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': errorResponse,
              'bg-green-100 text-green-500': successfulResponse,
            }"
          >
            {{ errorResponse || successfulResponse }}
          </div>
          <form @submit.prevent="authAction('register')" class="space-y-4">
            <!-- Username input -->
            <div>
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
                  @input="validatePassword(password)"
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
            <Button name="Register" variant="auth" :isLoading="isLoading" />
            <div class="flex justify-center">
              <div class="w-2/3 h-px bg-black rounded-lg"></div>
            </div>
            <p class="text-sm text-center font-extralight">
              Already have an account?
              <nuxt-link to="/?modal=login" class="underline underline-offset-2">Sign-In </nuxt-link>
            </p>
          </form>
        </div>

        <!-- Demo Account -->
        <div v-else-if="showDemoLogin" class="flex flex-col items-center justify-center">
          <h2 class="text-lg text-center font-semibold text-gray-800">Demo Account</h2>
          <div class="flex justify-center items-center w-full h-96 rounded-lg text-base">
            <p v-if="demoSignInError">{{ demoSignInError }}</p>
            <p v-else>Loading, please wait while my free account from render.com restarts...</p>
          </div>
        </div>

        <!-- Login Form -->
        <div v-else class="space-y-4">
          <h2 class="text-lg text-center font-semibold text-gray-800">Sign-In</h2>
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': errorResponse,
              'bg-green-100 text-green-500': successfulResponse,
            }"
          >
            {{ errorResponse || successfulResponse }}
          </div>
          <form @submit.prevent="authAction('login')" class="space-y-4">
            <!-- Email input -->
            <div>
              <label for="Email">Email:</label>
              <input
                type="email"
                placeholder="Email"
                v-model="email"
                @input="validateEmail(email)"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{
                  'border-red-500': emailError || (errorResponse && email === ''),
                }"
              />
              <div class="text-red-500 text-xs text-center h-4">{{ emailError }}</div>
            </div>
            <!-- Password input -->
            <div>
              <label for="Password">Password:</label>
              <div class="relative flex items-center">
                <input
                  id="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  placeholder="Password"
                  v-model="password"
                  @input="validatePassword(password)"
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
              <div class="text-red-500 text-xs text-center h-8">{{ passwordError }}</div>
            </div>
            <Button name="Sign-In" variant="auth" :isLoading="isLoading" />
            <div class="flex justify-center">
              <div class="w-2/3 h-px bg-black rounded-lg"></div>
            </div>
            <p class="text-sm text-center font-extralight">
              No account?
              <nuxt-link to="/?modal=register" class="underline underline-offset-2">Register</nuxt-link>
            </p>
            <p class="text-sm text-center font-extralight">
              <nuxt-link to="/forgot-password" class="underline underline-offset-2">Forgot password</nuxt-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </dialog>
</template>
