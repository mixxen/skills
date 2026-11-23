import moment from "moment";

export function receiptLine(paidAt: string, termsDays: number): string {
  const paid = moment(paidAt);
  const nextDue = paid.clone().add(termsDays, "days");
  return `Paid ${paid.format("Do MMMM YYYY [at] h:mm A")} (${paid.format("ddd")}), next due ${nextDue.format("DD/MM/YYYY")}`;
}
