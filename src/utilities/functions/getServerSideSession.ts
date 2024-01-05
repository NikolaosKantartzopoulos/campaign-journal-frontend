import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next/types";

export const getSessionServerSide = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = (await getServerSession(req, res, authOptions)) as Session;
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = session?.user;
  return { user, session };
};

export const getAPISession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = (await getServerSession(req, res, authOptions)) as Session;
  const user = session?.user;
  return { user, session };
};
