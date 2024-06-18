import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: {
      username: null,
    },
  }),
  actions: {
    async checkAuth() {
      this.isLoading = true;
      try {
        const checkIfUserLoggedApiUrl = `${import.meta.env.VITE_API_URL}/auth/check`;
        const checkIfUserLoggedState = useApiFetch(checkIfUserLoggedApiUrl);

        watch(
          () => ({
            status: checkIfUserLoggedState.status,
            error: checkIfUserLoggedState.error,
            data: checkIfUserLoggedState.data,
            loading: checkIfUserLoggedState.loading,
          }),
          ({ status, error, data, loading }) => {
            console.log(status, error, data, loading);
            if (!loading) {
              this.isLoading = false;
            }

            if (status === 401) {
              if (error === "No token provided") {
                this.isAuthenticated = false;
                localStorage.removeItem("username");
                navigateTo("/");
              } else if (error === "Invalid token" || error === "Invalid refresh token") {
                this.handleInvalidToken();
              } else {
                this.isAuthenticated = false;
                localStorage.removeItem("username");
                navigateTo("/");
              }
            } else {
              this.isAuthenticated = true;
              this.user.username = data.username;
            }
          }
        );
      } catch (error) {
        this.isAuthenticated = false;
        this.isLoading = false;
        localStorage.removeItem("username");
        navigateTo("/");
      }
    },
    async handleTokenRefresh() {
      try {
        this.isAuthenticated = true;
        this.checkAuth();
      } catch (error) {
        this.isAuthenticated = false;
        localStorage.removeItem("username");
        navigateTo("/");
      }
    },
    handleInvalidToken() {
      this.isAuthenticated = false;
      this.logout();
      localStorage.removeItem("username");
      navigateTo("/");
    },
    async logout() {
      try {
        const logoutApiUrl = `${import.meta.env.VITE_API_URL}/auth/logout`;
        const logoutState = $fetchApi(logoutApiUrl, {
          method: "POST",
        });

        if (logoutState.error) {
          console.error("Logout failed");
        } else {
          this.isAuthenticated = false;
          localStorage.removeItem("username");
          navigateTo("/");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
});
