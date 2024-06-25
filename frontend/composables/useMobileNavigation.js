import { ref } from "vue";

export function useNavigation() {
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  return {
    isMenuOpen,
    toggleMenu,
  };
}
