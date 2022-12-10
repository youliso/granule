import { Router } from "../../src";

import * as test2 from "./pages/test2";

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
    component: test2,
  },
});
