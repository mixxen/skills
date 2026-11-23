import { useEffect, useState } from "react";

export function useSubscription<T>(subscribe: (cb: (v: T) => void) => () => void, initial: T): T {
  const [value, setValue] = useState(initial);
  useEffect(() => subscribe(setValue), [subscribe]);
  return value;
}
