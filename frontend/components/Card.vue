<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deckTitle: {
    type: String,
    required: true,
  },
  deckColor: {
    type: String,
    default: "bg-gray-300",
  },
  color: {
    type: String,
    default: "bg-gray-300",
  },
  username: {
    type: String,
    required: true,
  },
  deckId: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
  },
});

const isFlipped = ref(false);
const isHovered = ref(false);

const isCardFavorite = ref(props.isFavorite);
function toggleFavorite() {
  const error = ref(null);
  const loading = ref(true);

  fetch(
    `${import.meta.env.VITE_API_URL}/users/${props.username}/decks/${
      props.deckId
    }/cards/${props.cardId}/favorite`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const errorMessage =
            body.error?.message ||
            response.statusText ||
            "Unknown error occurred";
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then((_) => {
      isCardFavorite.value = !isCardFavorite.value;
    })
    .catch((err) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div
    class="card-container perspective w-36 h-48 sm:w-40 sm:h-52"
    @click="isFlipped = !isFlipped"
  >
    <div
      class="card"
      :class="{ 'is-flipped': isFlipped }"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Front of the card -->
      <div
        :style="{ backgroundColor: deckColor }"
        class="card-face relative front border-slate-900 rounded-lg p-2 flex flex-col justify-between text-white transition-all duration-300 ease-in-out overflow-hidden"
        :class="isHovered ? 'scale-105' : 'scale-100'"
      >
        <div
          class="bg-gradient-to-l from-white/50 h-60 w-16 absolute -top-2 rotate-6 delay-75 transition-all duration-500 ease-in-out"
          :class="isHovered ? 'left-44' : '-left-20'"
        ></div>
        <div class="w-full">
          <div class="flex justify-between items-center">
            <p class="font-thin text-sm">{{ deckTitle }}</p>
            <Icons
              @click.stop="toggleFavorite()"
              :svgClass="`w-6 h-6 ${
                isCardFavorite ? 'fill-white' : 'hover:fill-white'
              }`"
              isType="star"
            />
          </div>
        </div>
        <p class="font-medium text-center">{{ title }}</p>
        <div class="flex justify-end">
          <nuxt-link :to="`/users/${username}/decks/${deckId}/cards/${cardId}`">
            <button
              class="flex items-center bg-black px-4 rounded-xl font-light text-sm"
            >
              <Icons svgClass="w-3 h-3 mr-1" isType="edit" /> Edit
            </button>
          </nuxt-link>
        </div>
      </div>

      <!-- Back of the card -->
      <div
        :style="{ borderColor: deckColor }"
        class="card-face back w-40 h-52 border-2 border-t-[6px] rounded-lg p-2 flex flex-col justify-center text-black"
      >
        <p class="font-light text-sm">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective {
  perspective: 1000px;
}

.card-container {
  cursor: pointer;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
}

.back {
  transform: rotateY(180deg);
}
</style>
