/**
 * Deletes data from the specified path.
 *
 * @param {string} path - The path to the data to be deleted.
 * @returns {Promise<any>} - A promise that resolves with the response data or rejects with an error.
 */
export function deleteData(path) {
  const error = ref(null);
  const loading = ref(true);

  return fetch(`http://localhost:3001/${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((body) => {
          const errorMessage = body.error?.message || response.statusText || "Unknown error occurred";
          throw new Error(errorMessage);
        });
      }

      return response.json();
      //   showModal.value = false;
      //   toggleModal();
      //   router.push(`/${redirectPath}`);
    })
    .catch((err) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}
