// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  app: {
    head: {
      title: "Card-It",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Create your cards, test your memory and remember it!",
        },
        { name: "keywords", content: "card-it" },
        { property: "og:title", content: "Card-It" },
        {
          property: "og:description",
          content:
            "Create your cards, test your memory and remember it!",
        },
        { property: "og:image", content: "/card-it-screen.jpg" },
        { property: 'og:url', content: 'https://card-it-frontend.onrender.com/' },
        {
          name: "twitter:card",
          content: "Create your cards, test your memory and remember it!",
        },
        { name: "twitter:site", content: "@vivieng_webdev" },
        { name: "twitter:title", content: "Card-It" },
        {
          name: "twitter:description",
          content:
            "Create your cards, test your memory and remember it!",
        },
        {
          name: "twitter:image",
          content: "https://card-it-frontend.onrender.com/card-it-screen.jpg",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;900&display=swap",
        },
      ],
    },
  },
});
