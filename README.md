# dis-vue-router

A Vue router power by vue-router with Hooks

# Install

```sh
npm install dis-vue-router
```

# Usage

add: @/Layout/Index.ts:

```ts
import Layout from "@/Layout/Index.vue";
import { useDisRoute } from "dis-vue-router";
export default useDisRoute(Layout, {
  path: "/",
  redirect: "hello",
});
```

add: @/views/HelloView.ts:

```ts
import { useDisRoute } from "dis-vue-router";
import Layout from "@/Layout/Index.ts";
export default useDisRoute(()=>import("@/views/HelloView.vue")),{
  path: "hello",
  layout: Layout,
});
```

src\router\index.ts:

```ts
import { createRouter, createWebHistory } from "vue-router";
import { getDisRoutes } from "dis-vue-router";
import "@/views/HelloView.ts"; // enable route component

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getDisRoutes(), // getDisRoutes() will return all routes
});

export default router;
```
