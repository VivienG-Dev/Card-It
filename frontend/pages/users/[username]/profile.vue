<script setup>
// definePageMeta({
//   middleware: "auth",
// });

import { useRoute } from "vue-router";

const route = useRoute();
const authStore = useAuthStore();

const username = route.params.username;

function goBack() {
  navigateTo(`/users/${username}`);
}

const showModal = ref(false);
function hideModal() {
  showModal.value = false;
}
function deleteAccount() {
  const error = ref(null);
  const loading = ref(true);

  fetch(`${import.meta.env.VITE_API_URL}/users/${username}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const errorMessage = body.error?.message || response.statusText || "Unknown error occurred";
          throw new Error(errorMessage);
        });
      }

      showModal.value = false;
      authStore.logout();
    })
    .catch((err) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}

const name = ref("");
const password = ref("");
const updateUserProfileError = ref(null);
const updateUserProfileSuccess = ref(null);
const updateUserProfileLoading = ref(false);
function updateUserProfile() {
  if (!name.value && !password.value) {
    updateUserProfileError.value = "Please fill in at least one field to update.";
    return;
  }

  updateUserProfileError.value = null;
  updateUserProfileSuccess.value = null;
  updateUserProfileLoading.value = true;

  fetch(`${import.meta.env.VITE_API_URL}/users/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: name.value, password: password.value }),
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
    .then((data) => {
      updateUserProfileSuccess.value = data.message;
    })
    .catch((err) => {
      updateUserProfileError.value = err.message;
    })
    .finally(() => {
      updateUserProfileLoading.value = false;
    });
}

const userDataLoading = ref(false);
const userDataError = ref(null);
const namePlaceholder = ref("");
const emailPlaceholder = ref("");
onMounted(() => {
  userDataLoading.value = true;
  fetch(`${import.meta.env.VITE_API_URL}/users/${username}`, {
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
    .then((data) => {
      namePlaceholder.value = data.data.username;
      emailPlaceholder.value = data.data.email;
    })
    .catch((err) => {
      userDataError.value = err.message;
    })
    .finally(() => {
      userDataLoading.value = false;
    });
});
</script>

<template>
  <div class="flex flex-col space-y-16">
    <div class="flex justify-between">
      <div class="w-28">
        <Icons @click="goBack()" svgClass="w-8 h-8 cursor-pointer" isType="arrowLeft" />
      </div>
      <h2 class="text-center text-xl font-bold w-full">Profile</h2>
      <div class="w-28" />
    </div>

    <div v-if="userDataLoading">Loading...</div>
    <div v-else-if="userDataError" class="bg-white flex flex-col space-y-4 justify-center items-center p-10">
      <Icons svgClass="w-8 h-8" isType="locked" />
      <p class="text-2xl font-bold">{{ userDataError }}</p>
    </div>

    <div v-else class="flex flex-col items-center w-full space-y-4">
      <form @submit.prevent="updateUserProfile()" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div class="flex justify-center items-center w-full h-10 rounded-lg text-sm" :class="{
            'bg-red-100 text-red-500': updateUserProfileError,
            'bg-green-100 text-green-500': updateUserProfileSuccess,
          }">
            {{ updateUserProfileError || updateUserProfileSuccess }}
          </div>

          <label for="name" class="text-sm font-light">Username</label>
          <input type="text" id="name" name="name" v-model="name" :placeholder="namePlaceholder"
            class="border border-gray-300 rounded-lg p-2" />
        </div>
        <div class="flex flex-col space-y-2">
          <label for="email" class="text-sm font-light">Email</label>
          <input type="text" id="email" name="email" v-model="email" :placeholder="emailPlaceholder" disabled
            class="border border-gray-300 rounded-lg p-2" />
        </div>
        <div class="flex flex-col space-y-2">
          <label for="password" class="text-sm font-light">Password</label>
          <input type="text" id="password" name="password" v-model="password" placeholder="********"
            class="border border-gray-300 rounded-lg p-2" />
        </div>
        <div class="flex flex-col">
          <Button name="Save" color="bg-customPrimary text-white" />
        </div>
      </form>
      <div class="text-center">
        <button @click="showModal = true" class="text-red-600 text-base font-extralight">Delete my account</button>
        <Modal :isVisible="showModal" @confirm="deleteAccount()" @cancel="hideModal()">
          <template #content>
            <p>Are you sure you want to delete this account?</p>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svg-bg {
  position: absolute;
  z-index: -1;
  filter: blur(70px);
  transform: translate3d(0, 0, 0);
  /* Fix for Safari flickering */
  background-repeat: no-repeat;
  width: 70%;
  height: 60%;
  will-change: filter;
}

.svg-bg-1 {
  top: 20%;
  left: 0%;
  background-image: url("/Vector-1.svg");
  /* animation: one 10s infinite; */
}

.svg-bg-2 {
  top: 13%;
  left: 25%;
  background-image: url("/Vector-2.svg");
  /* animation: two 10s infinite delay(0.5s); */
}

.svg-bg-3 {
  top: 10%;
  left: 40%;
  background-image: url("/Vector-3.svg");
  /* animation: one 10s infinite; */
}

.svg-bg-4 {
  top: 10%;
  left: 40%;
  background-image: url("/Vector-4.svg");
  /* animation: two 10s infinite delay(0.5s); */
}
</style>
