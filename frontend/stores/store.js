export const useAppStore = defineStore("app", {
  state: () => ({
    pageTitle: "Dashboard",
    showGoBackButton: true,
  }),
  actions: {
    setPageTitle(title) {
      this.pageTitle = title;
    },
    setShowGoBackButton(show) {
      this.showGoBackButton = show;
    },
  },
});
