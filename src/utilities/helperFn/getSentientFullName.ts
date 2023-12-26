import { sentient } from "@prisma/client";

export default function getSentientFullName(sentient: sentient) {
  if (!sentient) return "";
  return sentient.first_name + " " + sentient.last_name;
}
