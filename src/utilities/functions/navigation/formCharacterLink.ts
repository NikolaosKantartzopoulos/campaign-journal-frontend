import { Prisma } from "@prisma/client";

export default function formCharacterLink(sentient: Prisma.sentientsSelect) {
  const lastNameString = sentient.last_name
    ? // @ts-ignore
      "-" + sentient.last_name.toLowerCase()
    : "";
  const target =
    // @ts-ignore
    "/characters/" + sentient.first_name.toLowerCase() + lastNameString;
  return target;
}
