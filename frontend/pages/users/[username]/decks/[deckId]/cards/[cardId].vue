<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const username = route.params.username;
const deckId = route.params.deckId;
const cardId = route.params.cardId;

const { titleError, descriptionError, validateTitle, validateDescription } = useValidation();

function goBack() {
  window.history.back();
}

const title = ref("");
const description = ref("");
const updateCardSuccess = ref(null);
const updateCardError = ref(null);
const updateCardLoading = ref(false);
async function updateCard() {
  updateCardError.value = null;
  updateCardSuccess.value = null;

  if (titleError.value || descriptionError.value) {
    updateCardError.value = "Please correct the errors before submitting.";
    return;
  }

  const updateCardApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}/cards/${cardId}`;
  const updateCardState = await $fetchApi(updateCardApiUrl, {
    method: "PATCH",
    body: JSON.stringify({
      title: title.value,
      description: description.value,
    }),
  });

  updateCardLoading.value = updateCardState.loading;

  if (updateCardState.data) {
    updateCardSuccess.value = "Card updated successfully";
  } else if (updateCardState.error) {
    updateCardError.value = updateCardState.error;
  }

  updateCardLoading.value = updateCardState.loading;
}

const showModal = ref(false);
function hideModal() {
  showModal.value = false;
}

const cardError = ref(null);
async function deleteCard() {
  const deleteCardApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}/cards/${cardId}`;
  const deleteCardState = await $fetchApi(deleteCardApiUrl, {
    method: "DELETE",
  });

  if (deleteCardState.data) {
    router.push(`/users/${username}/decks/${deckId}`);
  } else {
    cardError.value = deleteCardState.error || "An error occurred while deleting the card";
  }
}

const cardApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}/cards/${cardId}`;
const cardState = useApiFetch(cardApiUrl);

watch(cardState, (newState) => {
  if (newState.data) {
    title.value = newState.data.title;
    description.value = newState.data.description;
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
      <form @submit.prevent="updateCard()" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': updateCardError,
              'bg-green-100 text-green-500': updateCardSuccess,
            }"
          >
            {{ updateCardError || updateCardSuccess }}
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
              'border-red-500': updateCardError === 'Title cannot be empty' || titleError,
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
              'border-red-500': updateCardError === 'Description cannot be empty' || descriptionError,
            }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ descriptionError }}
          </div>
        </div>
        <div class="flex flex-col">
          <Button name="Edit the card" variant="confirm" :isLoading="updateCardLoading" />
        </div>
      </form>
      <div class="text-center">
        <Button @click="showModal = true" name="Delete the card" variant="delete" />
        <Modal :isVisible="showModal" @confirm="deleteCard()" @cancel="hideModal()">
          <template #content>
            <p>Are you sure you want to delete this card?</p>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>
