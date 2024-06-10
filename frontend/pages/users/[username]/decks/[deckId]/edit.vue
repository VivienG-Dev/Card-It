<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

const username = route.params.username;
const deckId = route.params.deckId;

function goBack() {
  navigateTo(`/users/${username}`);
}

const showModal = ref(false);
function toggleModal() {
  showModal.value = !showModal.value;
}

const { titleError, validateTitle } = useValidation();

const error = ref(null);
const loading = ref(false);
async function deleteDeck() {
  toggleModal();
  const result = await deleteData(`users/${username}/decks/${deckId}`);
  error.value = result?.error;
  loading.value = result?.loading;
  router.push(`/users/${username}`);
}

const title = ref("");
const updateDeckSuccess = ref(null);
const updateDeckError = ref(null);
async function updateDeck() {
  updateDeckError.value = null;

  const body = {
    title: title.value || deckState.data.title,
  };

  if (body.title === deckState.data.title) {
    updateDeckError.value = "No changes detected";
    deckState.error = false;
    return;
  }

  const updateDeckApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}`;
  const updateDeckState = await $fetchApi(updateDeckApiUrl, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (updateDeckState.data) {
    updateDeckSuccess.value = "Deck updated successfully";
    deckState.data = updateDeckState.data;
  } else if (updateDeckState.error) {
    updateDeckError.value = updateDeckState.error;
  }
}

const decksApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}`;
const deckState = useApiFetch(decksApiUrl);

watch(deckState, (newState) => {
  if (newState.data) {
    title.value = newState.data.title;
  }
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
      <div v-if="deckState.loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <form v-else @submit.prevent="updateDeck()" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': updateDeckError,
              'bg-green-100 text-green-500': updateDeckSuccess,
            }"
          >
            {{ updateDeckError || updateDeckSuccess }}
          </div>

          <label for="title" class="text-sm font-light">Deck Name</label>
          <input
            type="text"
            id="title"
            name="title"
            v-model="title"
            @input="validateTitle(title)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{
              'border-red-500': updateDeckError === 'Title cannot be empty' || titleError,
            }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ titleError }}
          </div>
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
