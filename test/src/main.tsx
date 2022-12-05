import { h, f, useElement, Router } from "../../src";
import { css } from "@emotion/css/macro";

const style = css`
  color: red;
`;

const [count, countElement] = useElement(0);

const addCount = () => {
  count.value++;
};

const test1 = async (query: any) => {
  console.log(query);
  return (
    <>
      {countElement}
      <div>test1</div>
      {countElement}
      <button onClick={addCount}>+add</button>
      <button onClick={() => router.push("/test?id=1")}>test2</button>
    </>
  );
};

const test2 = async (query: any) => {
  console.log(query);
  return (
    <>
      <div>test2</div>
      <div>{countElement}</div>
      <button onClick={addCount}>+add</button>
      <button onClick={() => router.back()}>back</button>
    </>
  );
};

const router = new Router("hash", {
  "/": {
    render: test1,
  },
  "/test": {
    render: test2,
  },
});

const routerEl = <div></div>;

router.mount(routerEl);

const index = (
  <div>
    <div>hello</div>
    {routerEl}
  </div>
);

document.body.appendChild(index);
