<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const username = route.params.username;

const deckState = reactive({
  decks: [],
  error: null,
  loading: false,
});
function fetchDecks(url, state) {
  state.loading = true;
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          throw new Error(body.error?.message || "Unknown error occurred");
        });
      }
      return response.json();
    })
    .then((data) => {
      state.decks = data.data;
    })
    .catch((err) => {
      state.error = err.message;
    })
    .finally(() => {
      state.loading = false;
    });
}
onMounted(() => {
  fetchDecks(`${import.meta.env.VITE_API_URL}/users/${username}/decks`, deckState);
});

const { isVisible: isModalAcceptSharedDeckVisible, toggle: toggleModalAcceptSharedDeck } = useModal();
const token = ref("");
function acceptSharedDeck() {
  fetch(`${import.meta.env.VITE_API_URL}/users/${username}/decks/accept-share/${token.value}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const error = new Error(body.error?.message || "Unknown error occurred");
          error.statusCode = body.error?.statusCode;
          throw error;
        });
      }
      return response.json();
    })
    .then(() => {
      return fetchDecks(`${import.meta.env.VITE_API_URL}/users/${username}/decks`, deckState);
    })
    .then((data) => {
      deckState.decks = data.data;
      toggleModalAcceptSharedDeck();
      token.value = "";
      deckState.error = null;
    })
    .catch((err) => {
      deckState.error = err.statusCode;
    });
}
</script>

<template>
  <div class="flex justify-between">
    <div class="w-28" />
    <h2 class="text-center text-xl font-bold w-full">Dashboard</h2>
    <div class="w-28" />
  </div>

  <div class="flex justify-between">
    <p>Deck list:</p>
    <div>
      <button @click="toggleModalAcceptSharedDeck" class="bg-customPrimary text-white px-4 rounded-lg">Accept shared
        link</button>
      <Modal :isVisible="isModalAcceptSharedDeckVisible" @confirm="acceptSharedDeck()"
        @cancel="toggleModalAcceptSharedDeck">
        <template #content>
          <p>Do you want to add a deck from someone else?</p>
          <div class="flex justify-center items-center w-full h-10 rounded-lg text-sm mt-2" :class="{
            'bg-red-100 text-red-500': deckState.error,
          }">
            {{ deckState.error ? "Invalid token" : "" }}
          </div>
          <input type="text" id="token" name="token" v-model="token" placeholder="c1847fd7-e51e-40ae-88ba-c0b4b06d9c56"
            class="border border-gray-300 rounded-lg p-2 mt-4 w-full" />
        </template>
      </Modal>
    </div>
  </div>
  <div v-if="deckState.loading">Loading decks...</div>
  <div v-else-if="deckState.error && deckState.error !== 404"
    class="bg-white flex flex-col space-y-4 justify-center items-center p-10">
    <Icons svgClass="w-8 h-8" isType="locked" />
    <p class="text-2xl font-bold">{{ deckState.error }}</p>
  </div>
  <div v-else class="bg-white flex flex-wrap gap-4 justify-center sm:justify-normal">
    <nuxt-link :to="`/users/${username}/decks`">
      <div
        class="bg-gray-300 w-36 h-48 sm:w-40 sm:h-52 rounded-lg flex justify-center items-center hover:ring-2 ring-blue-500 ring-offset-2 ring-offset-blue-100 cursor-pointer">
        <Icons svgClass="w-16 h-16" isType="plus" />
      </div>
    </nuxt-link>
    <Deck v-for="deck in deckState.decks" :key="deck.title" :title="deck.title" :color="deck.color"
      :link="`/users/${username}/decks/${deck.id}`" />
  </div>
</template>
