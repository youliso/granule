import { h, f, useElement } from '../../../src';
import { router } from '../routes';

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
      <div>
        <button onClick={addCount}>+add</button>
        <button onClick={addObjTest}>+addObjTest</button>
        <button onClick={() => router.push('/test')}>test</button>
        <button onClick={() => router.push('/test1')}>test1</button>
      </div>
      <div router></div>
    </div>
  );
};
