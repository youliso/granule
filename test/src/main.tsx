import { h, f } from "../../src";
import { useElement } from "../../src/proxy";

const [str, dom] = useElement("test");

str.value = "321";

const test = (
  <>
    <div>{dom}</div>
  </>
);

document.body.appendChild(test);
