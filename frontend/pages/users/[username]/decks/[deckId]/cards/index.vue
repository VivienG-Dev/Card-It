<script setup>
definePageMeta({
  layout: "authenticated",
});

import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { titleError, descriptionError, validateTitle, validateDescription } = useValidation();

const username = route.params.username;
const deckId = route.params.deckId;

function goBack() {
  window.history.back();
}

const title = ref("");
const description = ref("");
const createCardError = ref(null);
const createCardLoading = ref(false);
async function createCard() {
  const createCardApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}/cards`;
  const createCardState = await $fetchApi(createCardApiUrl, {
    method: "PUT",
    body: JSON.stringify({
      title: title.value,
      description: description.value,
    }),
  });

  createCardLoading.value = createCardState.loading;

  if (createCardState.data) {
    navigateTo(`/users/${username}/decks/${deckId}/`);
  } else if (createCardState.error) {
    createCardError.value = createCardState.error;
  }

  createCardLoading.value = createCardState.loading;
}
</script>

<template>
  <div class="flex flex-col space-y-16">
    <div class="flex justify-between">
      <div class="w-28">
        <Icons @click="goBack()" svgClass="w-8 h-8 cursor-pointer" isType="arrowLeft" />
      </div>
      <h2 class="text-center text-xl font-bold w-full">Create a card</h2>
      <div class="w-28" />
    </div>
    <div class="flex flex-col items-center w-full space-y-4">
      <form @submit.prevent="createCard()" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': createCardError,
            }"
          >
            {{ createCardError }}
          </div>

          <label for="title" class="text-sm font-light">Card Title</label>
          <input
            type="text"
            id="title"
            name="title"
            v-model="title"
            @input="validateTitle(title)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{
              'border-red-500': createCardError === 'Title cannot be empty' || titleError,
            }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ titleError }}
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <label for="description" class="text-sm font-light">Card Description</label>
          <textarea
            type="text"
            id="description"
            name="description"
            v-model="description"
            @input="validateDescription(description)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{
              'border-red-500': createCardError === 'Description cannot be empty' || titleError,
            }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ descriptionError }}
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <Button name="Create" variant="confirm" :isLoading="createCardLoading" />
        </div>
      </form>
    </div>
  </div>
</template>
