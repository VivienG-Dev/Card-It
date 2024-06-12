<script setup>
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
async function createCard() {
  const createCardApiUrl = `${import.meta.env.VITE_API_URL}/users/${username}/decks/${deckId}/cards`;
  const createCardState = await $fetchApi(createCardApiUrl, {
    method: "PUT",
    body: JSON.stringify({
      title: title.value,
      description: description.value,
    }),
  });

  if (createCardState.data) {
    navigateTo(`/users/${username}/decks/${deckId}/`);
  } else if (createCardState.error) {
    createCardError.value = createCardState.error;
  }
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
          <Button name="Create" color="bg-customPrimary text-white" />
        </div>
      </form>
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
