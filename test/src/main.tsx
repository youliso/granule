import { h, f, useElement } from "../../src";
import { css } from "@emotion/css/macro";

const style = css`
  color: red;
`;

const [count, countElement] = useElement(0, "div", style);

const addCount = () => {
  count.value++;
};

const test = (
  <>
    {countElement}
    <button onClick={addCount}>+add</button>
  </>
);

document.body.appendChild(test);
