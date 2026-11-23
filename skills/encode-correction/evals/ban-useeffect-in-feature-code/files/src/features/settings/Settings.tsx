import React, { useState } from "react";

export function Settings({ theme }: { theme: string }) {
  const [current, setCurrent] = useState(theme);
  React.useEffect(() => {
    setCurrent(theme);
  }, [theme]);
  return <p>Theme: {current}</p>;
}
