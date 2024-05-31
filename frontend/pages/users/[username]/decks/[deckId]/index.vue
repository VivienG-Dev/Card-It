<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useApiFetch } from "~/composables/useApiFetch";

const route = useRoute();

const username = route.params.username;
const deckId = ref(route.params.deckId);

// Go back
function goBack() {
  navigateTo(`/users/${username}`);
}

// Modal
const showModalGenerateShareLink = ref(false);
function toggleModalGenerateShareLink() {
  showModalGenerateShareLink.value = !showModalGenerateShareLink.value;
  copyTokenSuccess.value = "";
}

// Fetch deck detail
const deckApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${
  deckId.value
}`;
const deckState = useApiFetch(deckApiUrl);

// Fetch cards details
const cardsApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${
  deckId.value
}/cards`;
const cardsState = useApiFetch(cardsApiUrl);

// Generate share link
const generatedLink = ref("");
const generateShareLinkApiUrl = `${
  import.meta.env.VITE_API_URL
}/users/${username}/decks/${deckId.value}/generate-share-link`;
async function generateShareLink() {
  const generateShareLinkState = await $fetchApi(generateShareLinkApiUrl, {
    method: "PATCH",
  });
  if (generateShareLinkState.data) {
    generatedLink.value = generateShareLinkState.data.shareToken;
    toggleModalGenerateShareLink();
  }
  if (generateShareLinkState.error) {
    console.error(generateShareLinkState.error);
  }
}

// Copy token
const copyTokenSuccess = ref("");
function copyToken() {
  navigator.clipboard.writeText(generatedLink.value);
  copyTokenSuccess.value = "Token copied!";
}
</script>

<template>
  <div class="flex justify-between">
    <div class="w-28">
      <Icons
        @click="goBack()"
        svgClass="w-8 h-8 cursor-pointer"
        isType="arrowLeft"
      />
    </div>
    <h2 class="text-center text-xl font-bold w-full">Dashboard</h2>
    <div class="w-28" />
  </div>

  <div class="flex flex-col sm:flex-row justify-between">
    <h2>
      {{ deckState.data?.title ? deckState.data.title + ":" : "" }}
    </h2>
    <div>
      <div class="space-x-2">
        <button
          @click="generateShareLink()"
          class="bg-customPrimary text-white px-4 rounded-lg"
        >
          Generate share link
        </button>
        <nuxt-link :to="`/users/${username}/decks/${deckId}/edit`">
          <button class="bg-customPrimary text-white px-4 rounded-lg">
            Edit the Deck
          </button>
        </nuxt-link>
      </div>

      <Modal
        :isVisible="showModalGenerateShareLink"
        confirmNameButton="Copy"
        @confirm="copyToken()"
        @cancel="toggleModalGenerateShareLink"
      >
        <template #content>
          <p>You can copy the code below and give it to your friend!</p>
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm mt-2 mb-2"
            :class="{
              'bg-green-100 text-green-500': copyTokenSuccess,
            }"
          >
            {{ copyTokenSuccess }}
          </div>
          <p class="bg-gray-200 p-2 text-center rounded-lg">
            {{ generatedLink }}
          </p>
        </template>
      </Modal>
    </div>
  </div>
  <div
    v-if="cardsState.loading || deckState.loading"
    class="flex justify-center items-center h-64"
  >
    Loading...
  </div>
  <div
    v-else-if="cardsState.error && cardsState.error !== 404"
    class="bg-white flex flex-col space-y-4 justify-center items-center p-10"
  >
    <Icons svgClass="w-8 h-8" isType="locked" />
    <p class="text-2xl font-bold">{{ cardsState.error }}</p>
  </div>
  <div
    v-else
    class="bg-white flex flex-wrap gap-4 justify-center sm:justify-normal"
  >
    <nuxt-link :to="`/users/${username}/decks/${deckId}/cards`">
      <div
        class="bg-gray-300 w-36 h-48 sm:w-40 sm:h-52 rounded-lg flex justify-center items-center hover:ring-2 ring-blue-500 ring-offset-2 ring-offset-blue-100 cursor-pointer"
      >
        <Icons svgClass="w-16 h-16" isType="plus" />
      </div>
    </nuxt-link>
    <Card
      v-for="card in cardsState.data"
      :key="card.id"
      :title="card.title"
      :description="card.description"
      :deckTitle="card.deck_title"
      :deckColor="card.deck_color"
      :username="username"
      :deckId="deckId"
      :cardId="card.id"
      :isFavorite="card.is_favorite"
    />
  </div>
</template>
