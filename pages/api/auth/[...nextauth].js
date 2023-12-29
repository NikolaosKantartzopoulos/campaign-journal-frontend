import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // session callback is called whenever a session for that particular user is checked
      // in above function we created token.user=user
      session.user = token.user;
      // you might return this in new version
      return session;
    },
  },
  pages: {
    signIn: "/account/access",
  },
  session: {
    //make sure that json web token is created
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   user_name: { label: "Username", type: "text", placeholder: "jsmith" },
      //   user_password: { label: "Password", type: "password" },
      // },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const { user_name, user_password } = req.query;
        try {
          const validUserArray = await prisma.user.findMany({
            where: {
              user_name: user_name,
              user_password: user_password,
            },
          });

          if (!validUserArray.length) return null;
          const user = validUserArray[0];

          return user;
        } catch (err) {
          console.log(err);
          return null;
        }

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        // // Return null if user data could not be retrieved
        // return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
