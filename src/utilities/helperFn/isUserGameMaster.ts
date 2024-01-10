import { Session } from "next-auth";

export function isUserGameMaster(session: Session | null) {
  if (!session) return false;
  return session.user.user_id === session.user.selectedWorld?.game_master;
}
