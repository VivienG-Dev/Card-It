<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();

const {
  email: emailRegister,
  password: passwordRegister,
  username: usernameRegister,
  register,
  successfulResponse: successfulResponseRegister,
  errorResponse: errorResponseRegister,
} = useRegister();

const {
  email: emailSignIn,
  password: passwordSignIn,
  signIn,
  successfulResponse: successfulResponseSignIn,
  errorResponse: errorResponseSignIn,
} = useSignIn();

const {
  usernameError,
  emailError,
  passwordError,
  validateUsername,
  validateEmail,
  validatePassword,
} = useValidation();

watch(
  () => route.query.modal,
  (newVal) => {
    if (newVal === "register") {
      openModal(true);
    } else if (newVal === "login") {
      openModal(false);
    } else {
      isModalOpen.value = false;
    }
  }
);

const isModalOpen = ref(false);
const showRegisterForm = ref(false);
const usernameRef = ref(null);
const emailRef = ref(null);
const openModal = (isRegister) => {
  showRegisterForm.value = isRegister;
  isModalOpen.value = true;
  updateUrl(isRegister ? "register" : "login");
};

const closeModal = () => {
  isModalOpen.value = false;
  updateUrl(null);

  emailRegister.value = "";
  passwordRegister.value = "";
  usernameRegister.value = "";
  successfulResponseRegister.value = "";
  errorResponseRegister.value = "";

  emailSignIn.value = "";
  passwordSignIn.value = "";
  successfulResponseSignIn.value = "";
  errorResponseSignIn.value = "";

  usernameError.value = "";
  emailError.value = "";
  passwordError.value = "";
};

const updateUrl = (modalType) => {
  router.replace({ query: modalType ? { modal: modalType } : {} });
};

// Initial check in case the component is loaded with the query parameter
if (route.query.modal) {
  openModal(route.query.modal === "register");
}

function useRegister() {
  const email = ref("");
  const password = ref("");
  const username = ref("");

  const successfulResponse = ref("");
  const errorResponse = ref("");
  const isLoading = ref(false);

  const register = async () => {
    if (isLoading.value) {
      errorResponse.value =
        "Loading, please wait while my free account from render.com restarts...";
      return;
    }

    isLoading.value = true;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.value.toLowerCase(),
            email: email.value,
            password: password.value,
          }),
        }
      );

      const responseData = await response.json();

      if (authStore.isLoading) {
        errorResponse.value =
          "Loading, please wait while my free instance on Render.com restarts...";
      }

      if (response.ok) {
        errorResponse.value = "";
        successfulResponse.value =
          responseData.message || "Registration successful!";
        setTimeout(() => {
          router.push(`/?modal=login`);
        }, 2000);
      } else {
        successfulResponse.value = "";
        errorResponse.value =
          responseData.message || "An error occurred. Please try again.";
      }
    } catch (error) {
      errorResponse.value = "Registration failed. Please try again.";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    email,
    password,
    username,
    register,
    successfulResponse,
    errorResponse,
  };
}

function useSignIn() {
  const email = ref("");
  const password = ref("");

  const successfulResponse = ref("");
  const errorResponse = ref("");
  const isLoading = ref(false);

  const signIn = async () => {
    if (isLoading.value) {
      errorResponse.value =
        "Loading, please wait while my free account from render.com restarts...";
      return;
    }

    isLoading.value = true;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        successfulResponse.value = responseData.message || "Login successful!";
        authStore.isAuthenticated = true;
        authStore.user.username = responseData.user.username;
        localStorage.setItem("username", responseData.user.username);
        router.push(`/users/${responseData.user.username}`);
      } else {
        errorResponse.value =
          responseData.message || "An error occurred. Please try again.";
      }
    } catch (error) {
      errorResponse.value = "Login failed. Please try again.";
    } finally {
      isLoading.value = false;
    }
  };

  return { email, password, signIn, successfulResponse, errorResponse };
}

const isPasswordVisible = ref(false);
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

let username = ref("");
onMounted(() => {
  username.value = localStorage.getItem("username") || authStore.user.username;
});
const links = computed(() => [
  { name: "Dashboard", path: `/users/${username.value}` },
  { name: "Profile", path: `/users/${username.value}/profile` },
  { name: "Favorites", path: `/users/${username.value}/favorites` },
]);
</script>

<template>
  <div>
    <nav
      class="flex items-center justify-between bg-white shadow h-10 rounded-lg py-2 px-4"
    >
      <nuxt-link to="/">Card-It</nuxt-link>
      <ClientOnly>
        <div class="relative">
          <div
            v-if="authStore.isAuthenticated"
            class="flex space-x-4 space-y-1 font-light"
          >
            <button
              @click="toggleMenu"
              class="focus:outline-none flex sm:hidden"
            >
              <Icons
                :isType="isMenuOpen ? 'closeMenu' : 'menu'"
                svgClass="w-7 h-7"
              />
            </button>
            <div class="hidden sm:flex space-x-4">
              <nuxt-link :to="`/users/${username}`">Dashboard</nuxt-link>
            </div>
            <button class="hidden sm:flex" @click="authStore.logout">
              Logout
            </button>
          </div>
          <div v-else class="space-x-4 font-light flex">
            <button @click="openModal(true)">Register</button>
            <button @click="openModal(false)">Login</button>
          </div>
          <div
            v-if="isMenuOpen"
            class="absolute -right-3 mt-3 w-48 rounded-md shadow-lg bg-white z-50"
          >
            <div v-if="authStore.isAuthenticated" class="py-1">
              <nuxtLink
                v-for="link in links"
                :key="link.name"
                :to="link.path"
                class="flex flex-col w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click.native="isMenuOpen = false"
              >
                {{ link.name }}
              </nuxtLink>
              <button
                @click="authStore.logout"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click.native="isMenuOpen = false"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </ClientOnly>
    </nav>

    <dialog :open="isModalOpen" class="z-50">
      <!-- Overlay -->
      <div class="fixed backdrop-blur-sm backdrop-brightness-50 inset-0"></div>

      <!-- Modal content -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div
          class="bg-white rounded-lg shadow-lg py-3 px-14 w-[500px] h-[500px] mx-auto relative"
        >
          <Icons
            @click="closeModal"
            svgClass="w-7 h-7 absolute top-2 right-2"
            isType="close"
          />
          <!-- Register Form -->
          <div v-if="showRegisterForm" class="flex flex-col">
            <h2 class="text-lg text-center font-semibold text-gray-800">
              Create a new account
            </h2>
            <div
              class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
              :class="{
                'bg-red-100 text-red-500': errorResponseRegister,
                'bg-green-100 text-green-500': successfulResponseRegister,
              }"
            >
              {{ errorResponseRegister || successfulResponseRegister }}
            </div>
            <form @submit.prevent="register" class="space-y-4">
              <div>
                <label for="Username" class="font-normal text-sm mb-10"
                  >Username:</label
                >
                <input
                  type="text"
                  placeholder="Username"
                  name="Username"
                  ref="usernameRef"
                  v-model="usernameRegister"
                  @input="validateUsername(usernameRegister)"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500':
                      usernameError ||
                      (errorResponseRegister && usernameRegister === ''),
                  }"
                />
                <div class="text-red-500 text-xs text-center h-2">
                  {{ usernameError }}
                </div>
              </div>
              <div>
                <label for="Email" class="font-normal text-sm">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="Email"
                  v-model="emailRegister"
                  @input="validateEmail(emailRegister)"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500':
                      emailError ||
                      (errorResponseRegister && emailRegister === ''),
                  }"
                />
                <div class="text-red-500 text-xs text-center h-2">
                  {{ emailError }}
                </div>
              </div>
              <div>
                <label for="Password" class="font-normal text-sm"
                  >Password:</label
                >
                <div class="relative flex items-center">
                  <input
                    id="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="passwordRegister"
                    @input="validatePassword(passwordRegister)"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'border-red-500':
                        passwordErrorRegister ||
                        (errorResponseRegister && passwordRegister === ''),
                    }"
                  />
                  <Icons
                    @click="togglePasswordVisibility()"
                    svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
                    :isType="isPasswordVisible ? 'eye' : 'eyeSlash'"
                  />
                </div>

                <div class="text-red-500 text-xs text-center h-4">
                  {{ passwordError }}
                </div>
              </div>
              <Button name="Register" />
              <div class="flex justify-center">
                <div class="w-2/3 h-px bg-black rounded-lg"></div>
              </div>
              <p class="text-sm text-center font-extralight">
                Already have an account?
                <NuxtLink
                  to="/?modal=login"
                  class="underline underline-offset-2"
                  >Sign-In
                </NuxtLink>
              </p>
            </form>
          </div>

          <!-- Login Form -->
          <div v-else class="space-y-4">
            <h2 class="text-lg text-center font-semibold text-gray-800">
              Sign-In
            </h2>
            <div
              class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
              :class="{
                'bg-red-100 text-red-500': errorResponseSignIn,
                'bg-green-100 text-green-500': successfulResponseSignIn,
              }"
            >
              {{ errorResponseSignIn || successfulResponseSignIn }}
            </div>
            <form @submit.prevent="signIn" class="space-y-4">
              <div>
                <label for="Email">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  ref="emailRef"
                  v-model="emailSignIn"
                  @input="validateEmail(emailSignIn)"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{
                    'border-red-500':
                      emailError || (errorResponseSignIn && emailSignIn === ''),
                  }"
                />
                <div class="text-red-500 text-xs text-center h-4">
                  {{ emailError }}
                </div>
              </div>
              <div>
                <label for="Password">Password:</label>
                <div class="relative flex items-center">
                  <input
                    id="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="passwordSignIn"
                    @input="validatePassword(passwordSignIn)"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'border-red-500':
                        passwordError ||
                        (errorResponseSignIn && passwordSignIn === ''),
                    }"
                  />
                  <Icons
                    @click="togglePasswordVisibility()"
                    svgClass="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2"
                    :isType="isPasswordVisible ? 'eye' : 'eyeSlash'"
                  />
                </div>
                <div class="text-red-500 text-xs text-center h-8">
                  {{ passwordError }}
                </div>
              </div>
              <Button name="Sign-In" />
              <div class="flex justify-center">
                <div class="w-2/3 h-px bg-black rounded-lg"></div>
              </div>
              <p class="text-sm text-center font-extralight">
                No account?
                <NuxtLink
                  to="/?modal=register"
                  class="underline underline-offset-2"
                  >Register</NuxtLink
                >
              </p>
              <p class="text-sm text-center font-extralight">
                <NuxtLink
                  to="/forgot-password"
                  class="underline underline-offset-2"
                  >Forgot password</NuxtLink
                >
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
