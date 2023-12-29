import { user } from "@prisma/client";

import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: user;
  }
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: user;
    /** OpenID ID Token */
    idToken?: string;
  }
}
