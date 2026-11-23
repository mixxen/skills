import { format } from "date-fns";

export function Report({ generated }: { generated: Date }) {
  return <p>Generated {format(generated, "yyyy-MM-dd HH:mm")}</p>;
}
