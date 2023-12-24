import { sentients } from "@prisma/client";

export default function formCharacterLink(sentient: sentients) {
  return sentient.first_name + " " + sentient.last_name;
}
