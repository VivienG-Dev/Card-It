<script setup>
// definePageMeta({
//   middleware: "auth",
// });

import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const router = useRouter();

const username = ref(route.params.username);
const deckId = ref(route.params.deckId);

function goBack() {
  navigateTo(`/users/${username.value}`);
}

const showModal = ref(false);
function hideModal() {
  showModal.value = true;
}
function toggleModal() {
  showModal.value = !showModal.value;
}

const error = ref(null);
const loading = ref(false);
async function deleteDeck() {
  toggleModal();
  const result = await deleteData(`users/${username.value}/decks/${deckId.value}`);
  error.value = result?.error;
  loading.value = result?.loading;
  router.push(`/users/${username.value}`);
}

const title = ref("");
const updateDeckSuccess = ref(null);
const updateDeckError = ref(null);
const updateLoadingDeck = ref(false);
function updateDeck() {
  updateDeckSuccess.value = null;
  updateDeckError.value = null;
  updateLoadingDeck.value = true;

  const body = {
    title: title.value || deckState.details.title,
  };

  if (body.title === deckState.details.title) {
    updateDeckError.value = "No changes detected";
    updateLoadingDeck.value = false;
    return;
  }

  fetch(`${import.meta.env.VITE_API_URL}/users/${username.value}/decks/${deckId.value}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
      updateDeckSuccess.value = data.message;
      deckState.details = data.data;
    })
    .catch((err) => {
      updateDeckError.value = err.message;
    })
    .finally(() => {
      updateLoadingDeck.value = false;
    });
}

const deckState = reactive({
  details: [],
  error: null,
  loading: false,
});
// Reusable fetch function
function fetchData(url, state) {
  state.loading = true;
  fetch(url, {
    method: "GET",
    credentials: "include",
    // cache: "force-cache",
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
      if (data) {
        state.details = data.data;
      }
    })
    .catch((err) => {
      state.error = err.message;
    })
    .finally(() => {
      state.loading = false;
    });
}

onMounted(() => {
  fetchData(`${import.meta.env.VITE_API_URL}/users/${username.value}/decks/${deckId.value}`, deckState);
});
</script>

<template>
  <div class="flex flex-col space-y-16">
    <div class="flex justify-between">
      <div class="w-28">
        <Icons @click="goBack()" svgClass="w-8 h-8 cursor-pointer" isType="arrowLeft" />
      </div>
      <h2 class="text-center text-xl font-bold w-full">Dashboard</h2>
      <div class="w-28" />
    </div>
    <div class="flex flex-col items-center w-full space-y-4">
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <form v-else @submit.prevent="updateDeck()" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div class="flex justify-center items-center w-full h-10 rounded-lg text-sm" :class="{
            'bg-red-100 text-red-500': updateDeckError,
            'bg-green-100 text-green-500': updateDeckSuccess,
          }">
            {{ updateDeckError || updateDeckSuccess }}
          </div>

          <label for="title" class="text-sm font-light">Deck Name</label>
          <input type="text" id="title" name="title" v-model="title" :placeholder="deckState.details.title"
            class="border border-gray-300 rounded-lg p-2" />
        </div>
        <div class="flex flex-col">
          <Button name="Edit the deck" color="bg-customPrimary text-white" />
        </div>
      </form>
      <div class="text-center">
        <button @click="toggleModal" class="text-red-600 text-base font-extralight">Delete the deck</button>
        <Modal :isVisible="showModal" @confirm="deleteDeck()" @cancel="toggleModal">
          <template #content>
            <p>Are you sure you want to delete this deck?</p>
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
