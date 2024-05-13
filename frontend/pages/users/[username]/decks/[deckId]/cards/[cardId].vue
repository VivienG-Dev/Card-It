<script setup>
// definePageMeta({
//   middleware: "auth",
// });

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const username = ref(route.params.username);
const deckId = ref(route.params.deckId);
const cardId = ref(route.params.cardId);

const { titleError, descriptionError, validateTitle, validateDescription } = useValidation();

function goBack() {
  navigateTo(`/users/${username.value}/decks/${deckId.value}`);
}

const title = ref("");
const description = ref("");
const updateCardSuccess = ref(null);
const updateCardError = ref(null);
const updateLoadingCard = ref(false);
function updateCard() {
  if (titleError.value || descriptionError.value) {
    updateCardError.value = "Please correct the errors before submitting.";
    return;
  }

  updateCardSuccess.value = null;
  updateCardError.value = null;
  updateLoadingCard.value = true;

  const body = {
    title: title.value || cardData.value.title,
    description: description.value || cardData.value.description,
  };

  if (body.title === cardData.value.title && body.description === cardData.value.description) {
    updateCardError.value = "No changes detected";
    updateLoadingCard.value = false;
    return;
  }

  fetch(`${import.meta.env.VITE_API_URL}/users/${username.value}/decks/${deckId.value}/cards/${cardId.value}`, {
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
      updateCardSuccess.value = data.message;
      cardData.value = data.data;
    })
    .catch((err) => {
      updateCardError.value = err.message;
    })
    .finally(() => {
      updateLoadingCard.value = false;
    });
}

const showModal = ref(false);
function hideModal() {
  showModal.value = false;
}
function deleteCard() {
  const error = ref(null);
  const loading = ref(true);

  fetch(`${import.meta.env.VITE_API_URL}/users/${username.value}/decks/${deckId.value}/cards/${cardId.value}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const errorMessage = body.error?.message || response.statusText || "Unknown error occurred";
          throw new Error(errorMessage);
        });
      }

      showModal.value = false;
      navigateTo(`/users/${username.value}/decks/${deckId.value}`);
    })
    .catch((err) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}

const cardData = ref({});
const cardError = ref(null);
const cardLoading = ref(false);
onMounted(() => {
  // Fetch the card details
  cardLoading.value = true;
  fetch(`${import.meta.env.VITE_API_URL}/users/${username.value}/decks/${deckId.value}/cards/${cardId.value}`, {
    method: "GET",
    credentials: "include",
    cache: "force-cache",
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
      cardData.value = data.data;
    })
    .catch((err) => {
      cardError.value = err.message;
    })
    .finally(() => {
      cardLoading.value = false;
    });
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
          <div class="flex justify-center items-center w-full h-10 rounded-lg text-sm" :class="{
            'bg-red-100 text-red-500': updateCardError,
            'bg-green-100 text-green-500': updateCardSuccess,
          }">
            {{ updateCardError || updateCardSuccess }}
          </div>

          <label for="title" class="text-sm font-light">Card Name</label>
          <input type="text" id="title" name="title" v-model="title" :placeholder="cardData.title"
            @input="validateTitle(title)" class="border border-gray-300 rounded-lg p-2"
            :class="{ 'border-red-500': updateCardError === 'Title cannot be empty' || titleError }" />
          <div class="text-red-500 text-xs text-center h-2">{{ titleError }}</div>
        </div>
        <div class="flex flex-col space-y-2">
          <label for="description" class="text-sm font-light">Card Description</label>
          <input type="text" id="description" name="description" v-model="description"
            :placeholder="cardData.description" @input="validateDescription(description)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{ 'border-red-500': updateCardError === 'Description cannot be empty' || descriptionError }" />
          <div class="text-red-500 text-xs text-center h-2">{{ descriptionError }}</div>
        </div>
        <div class="flex flex-col">
          <Button name="Edit the card" color="bg-customPrimary text-white" />
        </div>
      </form>
      <div class="text-center">
        <button @click="showModal = true" class="text-red-600 text-base font-light">Delete the card</button>
        <Modal :isVisible="showModal" @confirm="deleteCard()" @cancel="hideModal()">
          <template #content>
            <p>Are you sure you want to delete this card?</p>
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
