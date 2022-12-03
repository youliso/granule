import { h, f, useElement } from "../../src";

const [str, dom] = useElement("test", "div", "test");

setTimeout(() => {
  str.value = "32s2311";
}, 1000);

const test = <>{dom}</>;

document.body.appendChild(test);
