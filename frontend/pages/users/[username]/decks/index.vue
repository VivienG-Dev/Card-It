<script setup>
definePageMeta({
  layout: "authenticated",
});

import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { username } = route.params;

const { titleError, descriptionError, colorError, validateTitle, validateDescription, validateColor } = useValidation();

function goBack() {
  window.history.back();
}

function skipStep2() {
  navigateTo(`/users/${username}`);
}

const deckTitle = ref("");
const cardTitle = ref("");
const cardDescription = ref("");
const deckId = ref("");
const step = ref(1);
const colors = [
  "#E53E3E",
  "#DD6B20",
  "#D69E2E",
  "#38A169",
  "#319795",
  "#3182CE",
  "#5A67D8",
  "#805AD5",
  "#D53F8C",
  "#ED64A6",
  "#9F7AEA",
  "#667EEA",
  "#48BB78",
  "#F6AD55",
  "#ECC94B",
];
const selectedColor = ref(colors[0]);
const customColor = ref("");

function updateSelectedColor(color) {
  if (colors.includes(color)) {
    selectedColor.value = color;
  }
}

function updateCustomColor() {
  selectedColor.value = customColor.value;
}

const errorDeck = ref(null);
const loadingDeck = ref(false);
async function createDeck() {
  if (!deckTitle.value) {
    errorDeck.value = "You need at least a title to create a deck.";
    return;
  }

  if (titleError.value) {
    errorDeck.value = titleError.value || "Please correct the errors before submitting.";
    return;
  }

  loadingDeck.value = true;
  const createDeckApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks`;
  const createDeckState = await $fetchApi(createDeckApiUrl, {
    method: "PUT",
    body: JSON.stringify({
      title: deckTitle.value,
      color: selectedColor.value,
    }),
  });

  loadingDeck.value = createDeckState.loading;

  if (createDeckState.data) {
    deckId.value = createDeckState.data.id;
    step.value = 2;
  } else if (createDeckState.error) {
    errorDeck.value = createDeckState.error;
  }

  loadingDeck.value = createDeckState.loading;
}

const errorCard = ref(null);
async function createCard() {
  if (!cardTitle.value || !cardDescription.value) {
    errorCard.value = "You need to fill in all fields to create a card.";
    return;
  }

  if (titleError.value || descriptionError.value) {
    errorCard.value = titleError.value || descriptionError.value || "Please correct the errors before submitting.";
    return;
  }

  const createCardApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId.value}/cards`;
  const createCardState = await $fetchApi(createCardApiUrl, {
    method: "PUT",
    body: JSON.stringify({
      title: cardTitle.value,
      description: cardDescription.value,
    }),
  });

  if (createCardState.data) {
    navigateTo(`/users/${username}/decks/${deckId.value}`);
  } else if (createCardState.error) {
    errorCard.value = createCardState.error;
  }
}
</script>

<template>
  <div class="flex flex-col space-y-16">
    <div class="flex justify-between">
      <div class="w-28">
        <Icons @click="goBack()" svgClass="w-8 h-8 cursor-pointer" isType="arrowLeft" />
      </div>
      <h2 v-if="step === 1" class="text-center text-xl font-bold w-full">Create a deck</h2>
      <h2 v-else class="text-center text-xl font-bold w-full">Create a card</h2>
      <div class="w-28" />
    </div>
    <div class="flex flex-col items-center w-full space-y-4">
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between w-full sm:w-[450px] relative">
        <div
          :class="step === 1 ? 'bg-customPrimaryDark' : 'bg-customPrimary'"
          class="py-1 px-1 sm:px-4 text-white font-light rounded-lg border-2 border-customPrimary z-10 text-center sm:text-left"
        >
          Step 1 - Create a deck
        </div>
        <div class="hidden sm:flex sm:w-96 h-1 bg-customPrimary rounded-lg absolute top-1/2 -mt-0.5"></div>
        <div
          :class="step === 2 ? 'bg-customPrimaryDark' : 'bg-customPrimary'"
          class="py-1 px-1 sm:px-4 text-white font-light rounded-lg border-2 border-customPrimary z-10 text-center sm:text-left"
        >
          Step 2 - Create a card
        </div>
      </div>

      <form v-if="step === 1" @submit.prevent="createDeck" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': errorDeck,
            }"
          >
            {{ errorDeck }}
          </div>

          <label for="deckTitle" class="text-sm font-light">Deck Name</label>
          <input
            type="text"
            id="deckTitle"
            name="deckTitle"
            v-model="deckTitle"
            @input="validateTitle(deckTitle)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{ 'border-red-500': errorDeck }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ titleError }}
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <label for="deckColor" class="text-sm font-light">Deck color</label>
          <div class="flex flex-wrap items-center">
            <template v-for="color in colors" :key="color">
              <div
                :style="{ backgroundColor: color }"
                class="h-10 w-10 m-1 rounded-full cursor-pointer border-2 shadow-md"
                :class="{
                  'border-black': selectedColor === color,
                  'border-white': selectedColor !== color,
                }"
                @click="updateSelectedColor(color)"
              ></div>
            </template>
            <input
              type="text"
              id="customColor"
              placeholder="#FFFFFF"
              class="border border-gray-300 rounded-lg shadow-sm pl-2 w-32 h-10"
              v-model="customColor"
              @input="validateColor(updateCustomColor)"
            />
            <div class="text-red-500 text-xs text-center h-2">
              {{ colorError }}
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <Button name="Create the deck" variant="confirm" :isLoading="loadingDeck" />
        </div>
      </form>

      <form v-else @submit.prevent="createCard" class="space-y-4 w-full sm:w-[450px]">
        <div class="flex flex-col space-y-2">
          <div
            class="flex justify-center items-center w-full h-10 rounded-lg text-sm"
            :class="{
              'bg-red-100 text-red-500': errorCard,
            }"
          >
            {{ errorCard }}
          </div>

          <label for="cardTitle" class="text-sm font-light">Card Name</label>
          <input
            type="text"
            id="tcardTitleitle"
            name="cardTitle"
            v-model="cardTitle"
            @input="validateTitle(cardTitle)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{
              'border-red-500': titleError || errorCard === `Title cannot be empty`,
            }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ titleError }}
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <label for="description" class="text-sm font-light">Card Description</label>
          <input
            type="text"
            id="cardDescription"
            name="cardDescription"
            v-model="cardDescription"
            @input="validateDescription(cardDescription)"
            class="border border-gray-300 rounded-lg p-2"
            :class="{
              'border-red-500': descriptionError || errorCard === `Description cannot be empty`,
            }"
          />
          <div class="text-red-500 text-xs text-center h-2">
            {{ descriptionError }}
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <Button name="Create the card" variant="confirm" :isLoading="loadingDeck" />
          <button @click="skipStep2()" class="text-sm font-light text-red-500 text-right">Skip the step 2</button>
        </div>
      </form>
    </div>
  </div>
</template>
