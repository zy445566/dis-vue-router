# dis-vue-router

A Vue router power by vue-router with @Decorator

# Install

```sh
npm install dis-vue-router
```

# Usage

```ts
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useDisRoute, getDisRoutes } from "dis-vue-router";

useDisRoute(HomeView, {
  path: "/",
  name: "home",
});

useDisRoute(import("../views/AboutView.vue"), {
  path: "/about",
  name: "about",
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getDisRoutes(), // getDisRoutes() will return all routes
});

export default router;
```
