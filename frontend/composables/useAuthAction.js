import { ref } from "vue";
import { useRouter } from "vue-router";

export function useAuthAction() {
  const router = useRouter();
  const authStore = useAuthStore();

  const isLoading = ref(false);
  const errorResponse = ref("");
  const successfulResponse = ref("");
  const demoSignInError = ref(null);

  const authAction = async (actionType, credentials) => {
    if (isLoading.value) {
      errorResponse.value = "Loading, please wait while my free account from render.com restarts...";
      return;
    }

    isLoading.value = true;
    errorResponse.value = "";
    successfulResponse.value = "";

    try {
      const registerOrLoginApiurl = `${import.meta.env.VITE_API_URL}/auth/${
        actionType === "register" ? "register" : "sign-in"
      }`;
      const method = actionType === "register" ? "PUT" : "POST";
      const body = JSON.stringify(credentials);

      const registerOrLoginState = await $fetchApi(registerOrLoginApiurl, { method, body });

      if (registerOrLoginState.data) {
        successfulResponse.value =
          registerOrLoginState.data.message || `${actionType === "register" ? "Registration" : "Login"} successful!`;
        if (actionType === "register") {
          setTimeout(() => {
            router.push({ path: "/", query: { modal: "login" } });
          }, 2000);
        } else {
          authStore.isAuthenticated = true;
          authStore.user.username = registerOrLoginState.data.user.username;
          localStorage.setItem("username", registerOrLoginState.data.user.username);
          router.push(`/users/${registerOrLoginState.data.user.username}`);
        }
      } else if (registerOrLoginState.error) {
        handleErrorResponse(registerOrLoginState.error);
      }
    } catch {
      errorResponse.value = `${actionType === "register" ? "Registration" : "Login"} failed. Please try again.`;
    } finally {
      isLoading.value = false;
    }
  };

  const goToDemoAccount = async () => {
    if (authStore.isLoading) {
      isLoading.value = true;
    }

    const demoAccountApiUrl = `${import.meta.env.VITE_API_URL}/auth/demo-sign-in`;
    const demoAccountState = await $fetchApi(demoAccountApiUrl, { method: "POST" });

    if (demoAccountState.data) {
      isLoading.value = false;
      localStorage.setItem("username", demoAccountState.data.user.username);
      window.location.href = `/users/${demoAccountState.data.user.username}`;
    } else if (demoAccountState.error) {
      isLoading.value = false;
      demoSignInError.value = demoAccountState.error;
    }
  };

  const handleErrorResponse = (error) => {
    switch (error) {
      case "User already exists":
      case "Email already exists":
      case "User not found":
      case "Invalid email or password":
        errorResponse.value = error;
        break;
      case "Password is required":
      case "Email is required":
      case "Username is required":
        // These errors are handled by the validation composable
        break;
      default:
        errorResponse.value = "An error occurred. Please try again.";
    }
  };

  return {
    authAction,
    goToDemoAccount,
    isLoading,
    errorResponse,
    successfulResponse,
    demoSignInError,
  };
}
