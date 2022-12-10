import { h } from "../../../src";
import { router } from "../routes";

export const render = async () => {
  return (
    <div>
      <div>test3</div>
      <button
        onClick={() =>
          router.push("/test2?id=1", {
            test: 3,
          })
        }
      >
        test2
      </button>
    </div>
  );
};
