import { location } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    selectedWorld?: location;
    selectedHero?: sentient;
  }
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: User;
    /** OpenID ID Token */
    idToken?: string;
    selectedWorld?: location;
    selectedHero?: sentient;
  }

  interface Account {
    user: User;
    /** OpenID ID Token */
    idToken?: string;
    selectedWorld?: location;
    selectedHero?: sentient;
  }

  interface User {
    /** OpenID ID Token */
    user_id: number;
    user_name: string;
    user_password: string | null;
    location_id: number | null;
    sentient_id: number | null;
    selectedWorld?: location;
    selectedHero?: sentient;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: User;
    /** OpenID ID Token */
    idToken?: string;
    selectedWorld?: location;
    selectedHero?: sentient;
  }
}
