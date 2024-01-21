import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ManageLocation = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  return <div>ManageLocation</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  await withServerSessionGuard(ctx);
  return {
    props: {},
  };
};

export default ManageLocation;
