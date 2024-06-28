import { useRoute } from "vue-router";

export function useUserNavigation() {
  const authStore = useAuthStore();
  const username = localStorage.getItem("username") || authStore.user.username;

  const links = [
    { name: "Dashboard", path: `/users/${username}` },
    { name: "Profile", path: `/users/${username}/profile` },
    { name: "Favorites", path: `/users/${username}/favorites` },
  ];

  return { links, username };
}
