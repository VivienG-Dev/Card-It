export function useModal(initialVisibility = false) {
  const isVisible = ref(initialVisibility);
  const toggle = () => {
    isVisible.value = !isVisible.value;
  };

  return { isVisible, toggle };
}
