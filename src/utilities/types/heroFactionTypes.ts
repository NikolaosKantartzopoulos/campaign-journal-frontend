import { faction } from "@prisma/client";

export interface userMinimumInfo {
  user_id: number;
  user_name: string;
}

export interface heroFactionTypes {
  faction: faction;
  usersSubscribed: userMinimumInfo[];
}
