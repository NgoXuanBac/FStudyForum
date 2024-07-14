import { RefObject, useMemo, useSyncExternalStore } from "react";

function subscribe(callback: (e: Event) => void) {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
}

function useSize(ref: RefObject<HTMLElement>) {
  const size = useSyncExternalStore(subscribe, () =>
    JSON.stringify({
      width: ref.current?.offsetWidth ?? 0,
      height: ref.current?.offsetHeight ?? 0
    })
  );
  return useMemo(() => JSON.parse(size), [size]);
}

export { useSize };
