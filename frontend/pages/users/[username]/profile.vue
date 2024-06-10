<script setup>
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
async function deleteAccount() {
  const deleteUserUrl = `${
    import.meta.env.VITE_API_URL
  }/users/${username}/delete`;
  const deleteUserState = await $fetchApi(deleteUserUrl, {
    method: "DELETE",
  });

  if (!deleteUserState.error) {
    showModal.value = false;
    authStore.logout();
  } else {
    console.error(deleteUserState.error);
  }
}

const name = ref("");
const password = ref("");
const updateUserProfileError = ref(null);
const updateUserProfileSuccess = ref(null);
const updateUserProfileLoading = ref(false);
async function updateUserProfile() {
  if (!name.value && !password.value) {
    updateUserProfileError.value =
      "Please fill in at least one field to update.";
    return;
  }

  const updateUserProfileApiUrl = `${
    import.meta.env.VITE_API_URL
  }/users/${username}`;
  const updateUserProfileState = await $fetchApi(updateUserProfileApiUrl, {
    method: "PATCH",
    body: JSON.stringify({ username: name.value, password: password.value }),
  });

  if (!updateUserProfileState.error) {
    updateUserProfileError.value = null;
    updateUserProfileSuccess.value = updateUserProfileState.data.message;
  } else {
    updateUserProfileError.value = updateUserProfileState.error;
  }
}

const userDataApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}`;
const userDataState = useApiFetch(userDataApiUrl);
</script>

<template>
  <div class="flex flex-col space-y-16">
    <div class="flex justify-between">
      <div class="w-28">
        <Icons
          @click="goBack()"
          svgClass="w-8 h-8 cursor-pointer"
          isType="arrowLeft"
        />
      </div>
      <h2 class="text-center text-xl font-bold w-full">Profile</h2>
      <div class="w-28" />
    </div>

    <div v-if="userDataState.loading">Loading...</div>
    <div
      v-else-if="userDataState.error"
      class="bg-white flex flex-col space-y-4 justify-center items-center p-10"
    >
      <Icons svgClass="w-8 h-8" isType="locked" />
      <p class="text-2xl font-bold">{{ userDataState.error }}</p>
    </div>

    <div v-else class="flex flex-col items-center w-full space-y-4">
      <form
        @submit.prevent="updateUserProfile()"
        class="space-y-4 w-full sm:w-[450px]"
      >
        <div class="flex flex-col space-y-2">
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': updateUserProfileError,
              'bg-green-100 text-green-500': updateUserProfileSuccess,
            }"
          >
            {{ updateUserProfileError || updateUserProfileSuccess }}
          </div>

          <label for="name" class="text-sm font-light">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="name"
            :placeholder="userDataState?.data?.username"
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="flex flex-col space-y-2">
          <label for="email" class="text-sm font-light">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            :placeholder="userDataState?.data?.email"
            disabled
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="flex flex-col space-y-2">
          <label for="password" class="text-sm font-light">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            v-model="password"
            placeholder="********"
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="flex flex-col">
          <Button name="Save" color="bg-customPrimary text-white" />
        </div>
      </form>
      <div class="text-center">
        <button
          @click="showModal = true"
          class="text-red-600 text-base font-extralight"
        >
          Delete my account
        </button>
        <Modal
          :isVisible="showModal"
          @confirm="deleteAccount()"
          @cancel="hideModal()"
        >
          <template #content>
            <p>Are you sure you want to delete this account?</p>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>
