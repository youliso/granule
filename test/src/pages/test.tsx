import { router } from "../routes";
import { h } from "../../../src";

export const render = async () => {
  return (
    <div>
      <div>test</div>
      <div router></div>
      <button onClick={() => router.push("/test/test3")}>test3</button>
    </div>
  );
};
