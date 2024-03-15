import { Router } from "../../src";


export const router = new Router("hash", {
  "/": {
    component: () => import("./pages/main"),
    children: {
      test1: {
        component: () => import("./pages/test1"),
      },
    },
  },
  "/test": {
    component: () => import("./pages/test"),
  },
});
