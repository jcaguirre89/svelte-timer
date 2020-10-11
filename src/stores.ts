import { readable } from "svelte/store";

export const time = readable(0, function start(set) {
  const begginingTime = new Date().getTime();
  const interval = setInterval(() => {
    const currentTime = new Date().getTime();
    set(currentTime - begginingTime);
  }, 10);
  return function stop() {
    set(0);
    clearInterval(interval);
  };
});
