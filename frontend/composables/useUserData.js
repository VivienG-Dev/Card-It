/**
 * Custom composable function for fetching user data.
 * @param {string} username - The username of the user to fetch data for.
 * @returns {Object} - An object containing userData, error, and loading properties.
 */
export function useUserData(username) {
  const userData = ref(null);
  const error = ref(null);
  const loading = ref(false);

  loading.value = true;
  fetch(`${import.meta.env.VITE_API_URL}/users/${username}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const errorMessage = body.error?.message || "Unknown error occurred";
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then((data) => {
      userData.value = data;
    })
    .catch((err) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });

  return { userData, error, loading };
}
