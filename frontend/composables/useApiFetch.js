// useFetch for GET requests
export function useApiFetch(apiUrl, options = {}) {
  const state = reactive({
    data: null,
    error: null,
    loading: false,
    status: null,
  });

  const { data, pending, error } = useFetch(apiUrl, {
    credentials: "include",
    cache: "no-cache",
    ...options,
  });

  watch(data, (newData) => {
    state.data = newData?.data || newData || null;
  });

  watch(pending, (isLoading) => {
    state.loading = isLoading;
  });

  watch(error, (fetchError) => {
    state.error = fetchError?.data.message || fetchError.message || "Unknown error occurred";
    state.status = fetchError?.statusCode || null;
  });

  return state;
}

// $fetch for POST, PATCH, PUT, DELETE requests
export async function $fetchApi(url, options = {}) {
  const state = reactive({
    data: null,
    error: null,
    loading: false,
  });

  try {
    state.loading = true;
    const response = await $fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    state.data = response?.data || response || null;
  } catch (fetchError) {
    // Validation errors
    if (fetchError?.data?.errors && Array.isArray(fetchError.data.errors) && fetchError.data.errors.length > 0) {
      state.error = fetchError?.data?.errors[0].msg;
    } else {
      // Custom errors or fallback to a generic error message
      state.error = fetchError?.data?.message || fetchError?.message || "Unknown error occurred";
    }
  } finally {
    state.loading = false;
  }

  return state;
}
