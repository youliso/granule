import { h, f, useProxy, useElement, getValueByAKey } from '../../../src';
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

const [date, dateElement] = useElement(Date());

setInterval(() => {
  date.value = Date();
}, 1000);

const [count, countElement] = useElement(0);

const addCount = () => {
  count.value++;
};

const [obj, objElement] = useElement({
  test: 0,
  datae: [{ s: 1 }],
  dataae: { t: 2 }
});

const addObjTest = () => {
  obj.value.dataae.t++;
};

export const render = async () => {
  return (
    <div>
      <div>{objElement`dataae.t`}</div>
      <div>{countElement}</div>
      <div>{dateElement}</div>
      <div>main</div>
      <div router></div>
      <div>
        <button onClick={addCount}>+add</button>
        <button onClick={addObjTest}>+addObjTest</button>
        <button onClick={updateList}>+update</button>
        <button onClick={() => router.push('/test')}>test</button>
      </div>
    </div>
  );
};
