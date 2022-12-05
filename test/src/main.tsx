import { h, f, useProxy, useElement, Router } from "../../src";
import { css } from "@emotion/css/macro";

const style = css`
  color: red;
`;
const [list, listElement] = useProxy([
  {
    a: 1,
    b: 2,
    c: 3,
  },
  {
    a: 1,
    b: 2,
    c: 3,
  },
]);

listElement((cbType: string, cb: any) => {
  console.log(cbType, cb);
});

const [count, countElement] = useElement(0);

const addCount = () => {
  count.value++;
};

const updateList = () => {
  list.value[1].a++;
};

const test1 = async () => {
  return (
    <div>
      {countElement}
      <div>test1</div>
      <div router></div>
      {countElement}
      <button onClick={addCount}>+add</button>
      <button onClick={updateList}>+update</button>
      <button onClick={() => router.push("/test/test3?id=1")}>test2</button>
    </div>
  );
};

const test2 = async () => {
  return (
    <div>
      <div>test2</div>
      <div router></div>
      <div>{countElement}</div>
      <button onClick={addCount}>+add</button>
      <button onClick={() => router.push("/test")}>/test</button>
    </div>
  );
};

const test3 = async () => {
  return (
    <div>
      <div>test3</div>
      <div>{countElement}</div>
      <button onClick={addCount}>+add</button>
      <button onClick={() => router.back()}>back</button>
    </div>
  );
};

const router = new Router("hash", {
  "/": {
    render: test1,
    children: {
      test: {
        render: test2,
        children: {
          test3: {
            render: test3,
          },
        },
      },
    },
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
