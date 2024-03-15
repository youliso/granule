import { h, f, useProxy, getValueByAKey } from '../../../src';
import { router } from '../routes';

const [list, listElement] = useProxy([
  {
    a: 1,
    b: 2,
    c: 3,
    e: [
      {
        test: {
          num: 1
        }
      }
    ]
  },
  {
    a: 1,
    b: 2,
    c: 3,
    e: []
  }
]);

listElement((cbType: string, cb: any) => {
  console.log(cb);
  console.log(getValueByAKey(list, cb.aKey), cb.aKey);
});

const updateList = () => {
  list.value[0].e[0].test.num++;
};

export const render = async () => {
  return (
    <div>
      <div>test</div>
      <div>
        <button onClick={updateList}>+update</button>
        <button onClick={() => router.back()}>back</button>
      </div>
    </div>
  );
};
