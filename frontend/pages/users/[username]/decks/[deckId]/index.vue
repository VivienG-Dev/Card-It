<script setup>
// definePageMeta({
//   middleware: "auth",
// });

import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();

const username = ref(route.params.username);
const deckId = ref(route.params.deckId);

function goBack() {
  navigateTo(`/users/${username.value}`);
}

const showModalGenerateShareLink = ref(false);
function toggleModalGenerateShareLink() {
  showModalGenerateShareLink.value = !showModalGenerateShareLink.value;
  copyTokenSuccess.value = "";
}

const deckState = reactive({
  details: [],
  error: null,
  loading: false,
});
const cardsState = reactive({
  details: [],
  error: null,
  loading: false,
});
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
  fetchData(`${import.meta.env.VITE_API_URL}/users/${username.value}/decks/${deckId.value}/cards`, cardsState);
});

const generatedLink = ref("");
function generateShareLink() {
  fetch(`http://localhost:3001/users/${username.value}/decks/${deckId.value}/generate-share-link`, {
    method: "PATCH",
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
    .then((link) => {
      generatedLink.value = link.shareToken;
      toggleModalGenerateShareLink();
    })
    .catch((err) => {
      console.error(err);
    });
}

const copyTokenSuccess = ref("");
function copyToken() {
  navigator.clipboard.writeText(generatedLink.value);
  copyTokenSuccess.value = "Token copied!";
}
</script>

<template>
  <div class="flex justify-between">
    <div class="w-28">
      <Icons @click="goBack()" svgClass="w-8 h-8 cursor-pointer" isType="arrowLeft" />
    </div>
    <h2 class="text-center text-xl font-bold w-full">Dashboard</h2>
    <div class="w-28" />
  </div>

  <div class="flex flex-col sm:flex-row justify-between">
    <p>{{ deckState.details.title ? deckState.details.title + ":" : "" }}</p>
    <div>
      <div class="space-x-2">
        <button @click="generateShareLink()" class="bg-customPrimary text-white px-4 rounded-lg">Generate share
          link</button>
        <nuxt-link :to="`/users/${username}/decks/${deckId}/edit`">
          <button class="bg-customPrimary text-white px-4 rounded-lg">Edit the Deck</button>
        </nuxt-link>
      </div>

      <Modal :isVisible="showModalGenerateShareLink" confirmNameButton="Copy" @confirm="copyToken()"
        @cancel="toggleModalGenerateShareLink">
        <template #content>
          <p>You can copy the code below and give it to your friend!</p>
          <div class="flex justify-center items-center w-full h-10 rounded-lg text-sm mt-2 mb-2" :class="{
            'bg-green-100 text-green-500': copyTokenSuccess,
          }">
            {{ copyTokenSuccess }}
          </div>
          <p class="bg-gray-200 p-2 text-center rounded-lg">{{ generatedLink }}</p>
        </template>
      </Modal>
    </div>
  </div>
  <div v-if="cardsState.loading">Loading...</div>
  <div v-else-if="cardsState.error && cardsState.error !== 404"
    class="bg-white flex flex-col space-y-4 justify-center items-center p-10">
    <Icons svgClass="w-8 h-8" isType="locked" />
    <p class="text-2xl font-bold">{{ cardsState.error }}</p>
  </div>
  <div v-else class="bg-white flex flex-wrap gap-4 justify-center sm:justify-normal">
    <nuxt-link :to="`/users/${username}/decks/${deckId}/cards`">
      <div
        class="bg-gray-300 w-36 h-48 sm:w-40 sm:h-52 rounded-lg flex justify-center items-center hover:ring-2 ring-blue-500 ring-offset-2 ring-offset-blue-100 cursor-pointer">
        <Icons svgClass="w-16 h-16" isType="plus" />
      </div>
    </nuxt-link>
    <Card v-for="card in cardsState.details" :key="card.id" :title="card.title" :description="card.description"
      :deckTitle="card.deck_title" :deckColor="card.deck_color" :username="username" :deckId="deckId" :cardId="card.id"
      :isFavorite="card.is_favorite" />
  </div>
</template>
