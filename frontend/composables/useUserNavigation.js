import { useRoute } from "vue-router";

export function useUserNavigation() {
  const route = useRoute();
  const username = route.params.username;

  const links = [
    { name: "Dashboard", path: `/users/${username}` },
    { name: "Profile", path: `/users/${username}/profile` },
    { name: "Favorites", path: `/users/${username}/favorites` },
  ];

  return { links, username };
}
