<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// Store and router
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const state = ref({
  email: "",
  password: "",
  username: "",
  successfulResponse: "",
  errorResponse: "",
  isLoading: false,
  isModalOpen: false,
  showRegisterForm: false,
  showDemoLogin: false,
  usernameError: "",
  emailError: "",
  passwordError: "",
});

const { usernameError, emailError, passwordError, validateUsername, validateEmail, validatePassword } = useValidation();
const { isMenuOpen, toggleMenu } = useNavigation();

// Watch route query for modal
watch(
  () => route.query.modal,
  (newVal) => {
    if (newVal === "register") {
      openModal("register");
    } else if (newVal === "login") {
      openModal("login");
    } else {
      state.value.isModalOpen = false;
    }
  }
);

// Modal control functions
const openModal = (modalType) => {
  state.value.showRegisterForm = modalType === "register";
  state.value.isModalOpen = true;
  updateUrl(modalType);
};

const closeModal = () => {
  state.value.isModalOpen = false;
  state.value.showDemoLogin = false;
  updateUrl(null);

  // Reset state
  state.value.email = "";
  state.value.password = "";
  state.value.username = "";
  state.value.successfulResponse = "";
  state.value.errorResponse = "";
  state.value.usernameError = "";
  state.value.emailError = "";
  state.value.passwordError = "";
};

const updateUrl = (modalType) => {
  router.replace({ query: modalType ? { modal: modalType } : {} });
};

// Initial check for query parameter
if (route.query.modal) {
  openModal(route.query.modal);
}

// Handle error responses
const handleErrorResponse = (error) => {
  switch (error) {
    case "User already exists":
    case "Email already exists":
      state.value.usernameError = error === "User already exists" ? error : "";
      state.value.emailError = error === "Email already exists" ? error : "";
      break;
    case "User not found":
      state.value.errorResponse = error;
      break;
    case "Password is required":
      state.value.passwordError = error;
      break;
    case "Email is required":
      state.value.emailError = error;
      break;
    case "Username is required":
      state.value.usernameError = error;
      break;
    case "Invalid email or password":
      state.value.errorResponse = error;
      break;
    default:
      state.value.errorResponse = "An error occurred. Please try again.";
  }
};

// Registration and sign-in functions
const authAction = async (actionType) => {
  if (state.value.isLoading) {
    state.value.errorResponse = "Loading, please wait while my free account from render.com restarts...";
    return;
  }

  state.value.isLoading = true;
  state.value.errorResponse = "";
  state.value.successfulResponse = "";
  state.value.usernameError = "";
  state.value.emailError = "";
  state.value.passwordError = "";

  // Validation
  if (passwordError.value || emailError.value || (usernameError.value && actionType === "register")) {
    state.value.passwordError = passwordError.value;
    state.value.emailError = emailError.value;
    state.value.usernameError = usernameError.value;
    state.value.isLoading = false;
    return;
  }

  try {
    const registerOrLoginApiurl = `${import.meta.env.VITE_API_URL}/auth/${
      actionType === "register" ? "register" : "sign-in"
    }`;
    const method = actionType === "register" ? "PUT" : "POST";
    const body =
      actionType === "register"
        ? JSON.stringify({
            username: state.value.username.toLowerCase(),
            email: state.value.email,
            password: state.value.password,
          })
        : JSON.stringify({ email: state.value.email, password: state.value.password });

    const registerOrLoginState = await $fetchApi(registerOrLoginApiurl, { method: method, body: body });

    if (registerOrLoginState.data) {
      state.value.successfulResponse =
        registerOrLoginState.data.message || `${actionType === "register" ? "Registration" : "Login"} successful!`;
      if (actionType === "register") {
        setTimeout(() => {
          navigateTo(`/?modal=login`);
        }, 2000);
      } else {
        authStore.isAuthenticated = true;
        authStore.user.username = registerOrLoginState.data.user.username;
        localStorage.setItem("username", registerOrLoginState.data.user.username);
        navigateTo(`/users/${registerOrLoginState.data.user.username}`);
      }
    } else if (registerOrLoginState.error) {
      handleErrorResponse(registerOrLoginState.error);
    }
  } catch {
    state.value.errorResponse = `${actionType === "register" ? "Registration" : "Login"} failed. Please try again.`;
  } finally {
    state.value.isLoading = false;
  }
};

// Toggle password visibility and menu
const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Retrieve username from local storage or store
const username = ref("");
onMounted(() => {
  username.value = localStorage.getItem("username") || authStore.user.username;
});
// Demo account sign-in
const demoSignInError = ref(null);
const goToDemoAccount = async () => {
  if (authStore.isLoading) {
    state.value.isLoading = true;
    state.value.showDemoLogin = true;
    state.value.isModalOpen = true;
  }

  const demoAccountApiUrl = `${import.meta.env.VITE_API_URL}/auth/demo-sign-in`;
  const demoAccountState = await $fetchApi(demoAccountApiUrl, { method: "POST" });

  if (demoAccountState.data) {
    state.value.isLoading = false;
    localStorage.setItem("username", demoAccountState.data.user.username);
    window.location.href = `/users/${demoAccountState.data.user.username}`;
  } else if (demoAccountState.error) {
    state.value.isLoading = false;
    demoSignInError.value = demoAccountState.error;
  }
};
</script>

<template>
  <div>
    <nav class="flex items-center justify-between bg-white shadow h-10 rounded-lg py-2 px-4">
      <nuxt-link to="/">Card-It</nuxt-link>
      <ClientOnly>
        <div class="relative">
          <div v-if="authStore.isAuthenticated" class="flex space-x-4 space-y-1 font-light">
            <button @click="toggleMenu" class="focus:outline-none flex sm:hidden">
              <Icons :isType="isMenuOpen ? 'closeMenu' : 'menu'" svgClass="w-7 h-7" />
            </button>
            <div class="hidden sm:flex space-x-4">
              <nuxt-link :to="`/users/${username}`">Dashboard</nuxt-link>
            </div>
            <button class="hidden sm:flex" @click="authStore.logout">Logout</button>
          </div>
          <div v-else class="space-x-1 sm:space-x-2 font-light flex">
            <Button @click="goToDemoAccount" name="Demo Account" variant="demo" :isLoading="state.isLoading" />
            <Button @click="openModal('register')" name="Register" variant="text" />
            <Button @click="openModal('login')" name="Login" variant="text" />
          </div>
          <MobileNavMenu :isMenuOpen="isMenuOpen" @update:isMenuOpen="toggleMenu" />
        </div>
      </ClientOnly>
    </nav>

    <dialog :open="state.isModalOpen" class="z-50">
      <!-- Overlay -->
      <div class="fixed backdrop-blur-sm backdrop-brightness-50 inset-0"></div>

      <!-- Modal content -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg py-3 px-14 w-[500px] h-[500px] mx-auto relative">
          <Icons @click="closeModal" svgClass="w-7 h-7 absolute top-2 right-2" isType="close" />

          <!-- Register Form -->
          <div v-if="state.showRegisterForm" class="flex flex-col">
            <h2 class="text-lg text-center font-semibold text-gray-800">Create a new account</h2>
            <div
              class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
              :class="{
                'bg-red-100 text-red-500': state.errorResponse,
                'bg-green-100 text-green-500': state.successfulResponse,
              }"
            >
              {{ state.errorResponse || state.successfulResponse }}
            </div>
            <form @submit.prevent="authAction('register')" class="space-y-4">
              <div>
                <label for="Username" class="font-normal text-sm mb-10">Username:</label>
                <input
                  type="text"
                  placeholder="Username"
                  name="Username"
                  v-model="state.username"
                  @input="validateUsername(state.username)"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500': state.usernameError || (state.errorResponse && state.username === ''),
                  }"
                />
                <div class="text-red-500 text-xs text-center h-2">{{ state.usernameError }}</div>
              </div>
              <div>
                <label for="Email" class="font-normal text-sm">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="Email"
                  v-model="state.email"
                  @input="validateEmail(state.email)"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500': state.emailError || (state.errorResponse && state.email === ''),
                  }"
                />
                <div class="text-red-500 text-xs text-center h-2">{{ state.emailError }}</div>
              </div>
              <div>
                <label for="Password" class="font-normal text-sm">Password:</label>
                <div class="relative flex items-center">
                  <input
                    id="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="state.password"
                    @input="validatePassword(state.password)"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'border-red-500': state.passwordError || (state.errorResponse && state.password === ''),
                    }"
                  />
                  <Icons
                    @click="togglePasswordVisibility()"
                    svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
                    :isType="isPasswordVisible ? 'eye' : 'eyeSlash'"
                  />
                </div>
                <div class="text-red-500 text-xs text-center h-4">{{ state.passwordError }}</div>
              </div>
              <Button name="Register" variant="auth" :isLoading="state.isLoading" />
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
          <div v-else-if="state.showDemoLogin" class="flex flex-col items-center justify-center">
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
                'bg-red-100 text-red-500': state.errorResponse,
                'bg-green-100 text-green-500': state.successfulResponse,
              }"
            >
              {{ state.errorResponse || state.successfulResponse }}
            </div>
            <form @submit.prevent="authAction('login')" class="space-y-4">
              <div>
                <label for="Email">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  v-model="state.email"
                  @input="validateEmail(state.email)"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500': state.emailError || (state.errorResponse && state.email === ''),
                  }"
                />
                <div class="text-red-500 text-xs text-center h-4">{{ state.emailError }}</div>
              </div>
              <div>
                <label for="Password">Password:</label>
                <div class="relative flex items-center">
                  <input
                    id="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="state.password"
                    @input="validatePassword(state.password)"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'border-red-500': state.passwordError || (state.errorResponse && state.password === ''),
                    }"
                  />
                  <Icons
                    @click="togglePasswordVisibility()"
                    svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
                    :isType="isPasswordVisible ? 'eye' : 'eyeSlash'"
                  />
                </div>
                <div class="text-red-500 text-xs text-center h-8">{{ state.passwordError }}</div>
              </div>
              <Button name="Sign-In" variant="auth" :isLoading="state.isLoading" />
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
  </div>
</template>

<style scoped>
.line {
  width: 20px;
  height: 2px;
  background-color: black;
  transition: all 0.3s;
}
</style>
