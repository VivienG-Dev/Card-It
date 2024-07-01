<script setup>
definePageMeta({
  layout: "authenticated",
});

import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const username = route.params.username;

// Fetch decks details
const decksApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks`;
const deckState = useApiFetch(decksApiUrl);

const { isVisible: isModalAcceptSharedDeckVisible, toggle: toggleModalAcceptSharedDeck } = useModal();

// Accept shared deck
const token = ref("");
const loadingAcceptSharedDeck = ref(false);
const errorAcceptSharedDeck = ref();
const acceptSharedDeck = async () => {
  const acceptShareUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/accept-share/`;
  const acceptShareState = await $fetchApi(acceptShareUrl, {
    method: "PUT",
    body: JSON.stringify({ token: token.value }),
  });

  loadingAcceptSharedDeck.value = acceptShareState.loading;

  if (acceptShareState.data) {
    const deckState = useApiFetch(decksApiUrl);
    toggleModalAcceptSharedDeck();
    token.value = "";
    deckState.error = null;
  } else if (acceptShareState.error) {
    errorAcceptSharedDeck.value = acceptShareState.error;
  }

  loadingAcceptSharedDeck.value = acceptShareState.loading;
};
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
      <Button @click="toggleModalAcceptSharedDeck" name="Accept shared link" variant="action" />
      <Modal
        :isVisible="isModalAcceptSharedDeckVisible"
        :isLoading="loadingAcceptSharedDeck"
        @confirm="acceptSharedDeck()"
        @cancel="toggleModalAcceptSharedDeck"
      >
        <template #content>
          <p>Do you want to add a deck from someone else?</p>
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm mt-2"
            :class="{
              'bg-red-100 text-red-500': errorAcceptSharedDeck,
            }"
          >
            {{ errorAcceptSharedDeck ? errorAcceptSharedDeck : "" }}
          </div>
          <input
            type="text"
            id="token"
            name="token"
            v-model="token"
            placeholder="c1847fd7-e51e-40ae-88ba-c0b4b06d9c56"
            class="border border-gray-300 rounded-lg p-2 mt-4 w-full"
          />
        </template>
      </Modal>
    </div>
  </div>
  <div v-if="deckState.loading">Loading decks...</div>
  <div
    v-else-if="deckState.error && deckState.error !== 404"
    class="bg-white flex flex-col space-y-4 justify-center items-center p-10"
  >
    <Icons svgClass="w-8 h-8" isType="locked" />
    <p class="text-2xl font-bold">{{ deckState.error }}</p>
  </div>
  <div v-else class="bg-white flex flex-wrap gap-4 justify-center sm:justify-normal">
    <nuxt-link :to="`/users/${username}/decks`">
      <div
        class="bg-gray-300 w-36 h-48 sm:w-40 sm:h-52 rounded-lg flex justify-center items-center hover:ring-2 ring-blue-500 ring-offset-2 ring-offset-blue-100 cursor-pointer"
      >
        <Icons svgClass="w-16 h-16" isType="plus" />
      </div>
    </nuxt-link>
    <Deck
      v-for="deck in deckState.data"
      :key="deck.title"
      :title="deck.title"
      :color="deck.color"
      :link="`/users/${username}/decks/${deck.id}`"
    />
  </div>
</template>
