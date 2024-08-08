import {
  RouteRecordRaw,
  RouteComponent,
  RouteRecordRedirectOption,
} from "vue-router";

declare type Lazy<T> = () => Promise<T>;
declare type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;

interface RouteConfig {
  path: string;
  name?: string;
  layout?: RawRouteComponent;
  redirect?: RouteRecordRedirectOption;
}

const routeDataMap: Map<
  RawRouteComponent,
  { config: RouteConfig; route: RouteRecordRaw }
> = new Map();
export function useDisRoute(
  routeComponent: RawRouteComponent,
  routeConfig: RouteConfig
) {
  const route: RouteRecordRaw = {
    path: routeConfig.path,
    component: routeComponent,
  };
  if (routeConfig.name) {
    route.name = routeConfig.name;
  }
  routeDataMap.set(routeComponent, {
    config: routeConfig,
    route,
  });
}

function finallyRoutes() {
  const routes: RouteRecordRaw[] = [];
  for (const [_key, { config, route }] of routeDataMap) {
    if (config.redirect) {
      if (!route.children) {
        route.children = [];
      }
      route.children.push({
        path: "",
        redirect: config.redirect,
      });
    }
    if (config.layout) {
      if (routeDataMap.has(config.layout)) {
        const layout = routeDataMap.get(config.layout);
        if (layout) {
          if (!layout.route.children) {
            layout.route.children = [];
          }
          layout.route.children.push(route);
        }
      } else {
        throw new Error("layout not registed use @Route or useDisRoute");
      }
    } else {
      routes.push(route);
    }
  }
  return routes;
}

export function getDisRoutes(): RouteRecordRaw[] {
  return finallyRoutes();
}
