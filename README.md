# dis-vue-router

A Vue router power by vue-router with Hooks

# Install

```sh
npm install dis-vue-router
```

# Usage

vite.config.ts:

```ts
import vue from '@vitejs/plugin-vue'
+ import { disRoutePlugin } from 'dis-vue-router'
export default defineConfig({
  plugins: [
    vue(),
+   disRoutePlugin(), // add this line after vue()
    vueJsx()
  ],
})
```

Layout/Index.vue:

```vue
<script lang="ts">
import { useDisRoute } from "dis-vue-router";
useDisRoute({
  path: "/",
  redirect: "hello",
});
</script>
// before setup script
<template>
  <div>
    <router-view />
  </div>
</template>
```

views/HelloView.vue:

```vue
<script lang="ts">
import { useDisRoute } from "dis-vue-router";
import Layout from "../Layout/Index.vue";
useDisRoute({
  path: "hello",
  layout: Layout,
});
</script>
// before setup script
```

src\router\index.ts:

```ts
import { createRouter, createWebHistory } from "vue-router";
import { getDisRoutes } from "dis-vue-router";
import "../views/HelloView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getDisRoutes(), // getDisRoutes() will return all routes
});

export default router;
```
