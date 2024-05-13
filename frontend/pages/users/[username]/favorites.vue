<script setup>
// definePageMeta({
//   middleware: "auth",
// });

import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const username = route.params.username;

const favoritesState = reactive({
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
  fetchData(`${import.meta.env.VITE_API_URL}/users/${username}/favorites`, favoritesState);
});

const goBack = () => {
  navigateTo(`/users/${username}`);
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
    <Card v-for="favorite in favoritesState.details" :key="favorite.id" :title="favorite.title"
      :description="favorite.description" :deckTitle="favorite.deck_title" :deckColor="favorite.deck_color"
      :username="username" :deckId="favorite.deck_id" :cardId="favorite.id" :isFavorite="favorite.is_favorite" />
  </div>
</template>
