import { sentient } from "@prisma/client";

export default function getSentientFullName(sentient: sentient) {
  if (!sentient) return "";
  if (!sentient.last_name) return sentient.first_name;
  return sentient.first_name + " " + sentient.last_name;
}
