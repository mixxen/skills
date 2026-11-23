import moment from "moment";

export function formatDueDate(iso: string): string {
  return moment(iso).format("DD MMM YYYY");
}

export function isOverdue(iso: string, now = new Date()): boolean {
  return moment(iso).isBefore(moment(now), "day");
}
