const isMenuOpen = ref(false);
export function useMobileNavigation() {
  const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);

  return {
    isMenuOpen,
    toggleMenu,
  };
}
