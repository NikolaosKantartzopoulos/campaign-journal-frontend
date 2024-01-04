import { faction } from "@prisma/client";

export interface heroFactionTypes {
  faction: faction;
  usersSubscribed: { user_id: number; user_name: string }[];
}
