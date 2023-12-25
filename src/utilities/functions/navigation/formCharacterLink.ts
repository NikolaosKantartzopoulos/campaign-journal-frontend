import { sentient } from "@prisma/client";

export default function formCharacterLink(sentient: sentient) {
  return sentient.first_name + " " + sentient.last_name;
}
