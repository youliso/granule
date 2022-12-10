import { h } from "../../../src";
import { router } from "../routes";

export const onLoad = (query: any) => {
  console.log(query);
};

export const render = async () => {
  return (
    <div>
      <div>test2</div>
      <button onClick={() => router.back()}>back</button>
    </div>
  );
};
