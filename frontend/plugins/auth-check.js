export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  if (process.client) {
    await authStore.checkAuth();
  }
});
