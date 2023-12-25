import { sentients } from "@prisma/client";

export default function (sentient: sentients) {
  if (!sentient) return "";
  return sentient.first_name + " " + sentient.last_name;
}
