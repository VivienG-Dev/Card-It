const isModalOpen = ref(false);
const showRegisterForm = ref(false);
const showDemoLogin = ref(false);

export function useAuthModal() {
  const route = useRoute();
  const router = useRouter();

  const openModal = (modalType) => {
    showRegisterForm.value = modalType === "register";
    isModalOpen.value = true;
    updateUrl(modalType);
  };

  const closeModal = () => {
    isModalOpen.value = false;
    showDemoLogin.value = false;
    updateUrl(null);
  };

  const updateUrl = (modalType) => {
    router.replace({ query: modalType ? { modal: modalType } : {} });
  };

  watch(
    () => route.query.modal,
    (newVal) => {
      if (newVal === "register") {
        openModal("register");
      } else if (newVal === "login") {
        openModal("login");
      } else {
        isModalOpen.value = false;
      }
    }
  );

  // Initial check for query parameter
  if (route.query.modal) {
    openModal(route.query.modal);
  }

  return {
    isModalOpen,
    showRegisterForm,
    showDemoLogin,
    openModal,
    closeModal,
  };
}
