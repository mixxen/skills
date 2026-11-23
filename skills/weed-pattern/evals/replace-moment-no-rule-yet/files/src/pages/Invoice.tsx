import moment from "moment";
import { formatDueDate } from "../utils/format";

export function Invoice({ issued, due }: { issued: string; due: string }) {
  return (
    <dl>
      <dt>Issued</dt><dd>{moment(issued).format("YYYY-MM-DD")}</dd>
      <dt>Due</dt><dd>{formatDueDate(due)}</dd>
    </dl>
  );
}
