import { h, f, useElement } from "../../src";

const [count, countElement] = useElement(0);

const addCount = () => {
  count.value++;
};

const test = (
  <>
    <div>{countElement}</div>
    <button onClick={addCount}>+add</button>
  </>
);

document.body.appendChild(test);
