import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next/types";

export const withServerSessionGuard = async (
  context: GetServerSidePropsContext
) => {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;
  const user = session?.user;
  if (!session || !user || !user.selectedWorld || !user.location_id) {
    return {
      redirect: {
        destination: "/account/access",
        permanent: false,
      },
    };
  }
  return { user, session };
};

export const getAPISession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = (await getServerSession(req, res, authOptions)) as Session;
  const user = session?.user;
  if (!session || !user) {
    throw new Error("Not authorized");
  }

  return { user, session };
};
