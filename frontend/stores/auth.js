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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const authStatus = await response.json();

        if (response.status === 401) {
          if (authStatus.error.message === "No token provided") {
            const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });

            if (!refreshResponse.ok) {
              throw new Error("Refresh token failed");
            }

            const refreshStatus = await refreshResponse.json();

            if (refreshStatus.error) {
              this.isAuthenticated = false;
              localStorage.removeItem("username");
              navigateTo("/");
            } else {
              this.isAuthenticated = true;
              this.user.username = refreshStatus.username;
            }
          } else if (
            authStatus.error.message === "Invalid token" ||
            authStatus.error.message === "Invalid token - ID not found"
          ) {
            // Handle the case where the token is invalid
            this.isAuthenticated = false;
            this.logout();
            localStorage.removeItem("username");
            navigateTo("/");
          }
        } else {
          this.isAuthenticated = true;
          this.user.username = authStatus.username;
        }
      } catch (error) {
        this.isAuthenticated = false;
        localStorage.removeItem("username");
        navigateTo("/");
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      this.isAuthenticated = false;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          localStorage.removeItem("username");
          navigateTo("/");
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
});
