import { h, f, useProxy, useElement } from "../../../src";
import { router } from "../routes";
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

export const render = async () => {
  return (
    <div class={style}>
      {countElement}
      <div>main</div>
      <div router></div>
      {countElement}
      <div>
        <button onClick={addCount}>+add</button>
        <button onClick={updateList}>+update</button>
        <button onClick={() => router.push("/test")}>test</button>
      </div>
    </div>
  );
};
