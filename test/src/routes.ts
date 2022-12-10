import { Router } from "../../src";


export const router = new Router("hash", {
  "/": {
    component: () => import("./pages/main"),
    children: {
      test: {
        component: () => import("./pages/test"),
        children: {
          test3: {
            component: () => import("./pages/test3"),
          },
        },
      },
    },
  },
  "/test2": {
    component: () => import("./pages/test2"),
  },
});
