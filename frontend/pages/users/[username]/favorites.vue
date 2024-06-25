<script setup>
definePageMeta({
  layout: "authenticated",
});

import { useRoute } from "vue-router";

const route = useRoute();

const username = route.params.username;

// Fetch favorites cards
const favoritesApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/favorites`;
const favoritesState = useApiFetch(favoritesApiUrl);

function goBack() {
  navigateTo(`/users/${username}`);
}

const updateFavorites = (cardId) => {
  // Find the card and update its favorite status
  const cardIndex = favoritesState.data.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    favoritesState.data.splice(cardIndex, 1);
  }
};
</script>

<template>
  <div class="flex justify-between">
    <div class="w-28">
      <Icons @click="goBack()" svgClass="w-8 h-8 cursor-pointer" isType="arrowLeft" />
    </div>
    <h2 class="text-center text-xl font-bold w-full">Dashboard</h2>
    <div class="w-28" />
  </div>
  <p>Favorite list:</p>
  <div v-if="favoritesState.loading">Loading...</div>
  <div v-else-if="favoritesState.error">{{ favoritesState.error }}</div>
  <div class="bg-white flex flex-wrap gap-4 justify-center sm:justify-normal">
    <Card
      v-for="favorite in favoritesState.data"
      :key="favorite.id"
      :title="favorite.title"
      :description="favorite.description"
      :deckTitle="favorite.deck_title"
      :deckColor="favorite.deck_color"
      :username="username"
      :deckId="favorite.deck_id"
      :cardId="favorite.id"
      :isFavorite="favorite.is_favorite"
      @favorite-toggled="updateFavorites($event)"
    />
  </div>
</template>
