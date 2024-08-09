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

export function disRoutePlugin(): {
  name: string;
  transform(code: string, id: string): string | undefined;
} {
  return {
    name: "dis-route-plugin",
    transform(code: string, id: string) {
      if (id.endsWith(".vue")) {
        if (/useDisRoute[\s]*\(/.exec(code)) {
          code = code.replace(
            /export[\s]+default[\s]+(.*)/,
            "const _export_dis_route_component = $1"
          );
          code += `\nexport default useDisRoute._export_dis_route(_export_dis_route_component);\n`;
        }
        return code;
      }
    },
  };
}

const routeDataMap: Map<
  RawRouteComponent,
  { config: RouteConfig; route: RouteRecordRaw }
> = new Map();
export function useDisRoute(routeConfig: RouteConfig) {
  useDisRoute.nowRouteConfig = routeConfig;
}
useDisRoute.nowRouteConfig = { path: "" };
useDisRoute._export_dis_route = (routeComponent: RawRouteComponent) => {
  const routeConfig: RouteConfig = useDisRoute.nowRouteConfig;
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
};

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
