import { h, f, useProxy, useElement } from '../../../src';
import { router } from '../routes';

const [list, listElement] = useProxy([
  {
    a: 1,
    b: 2,
    c: 3,
    e: [{
      test: 2
    }]
  },
  {
    a: 1,
    b: 2,
    c: 3,
    e: []
  }
]);

listElement((cbType: string, cb: any) => {
  console.log(cbType, cb);
});
const updateList = () => {
  list.value[0].e[0].test++;
};

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
