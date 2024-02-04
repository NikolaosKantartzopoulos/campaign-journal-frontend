import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import { GetServerSideProps } from "next";

const Journal = () => {
  return <h3>Journal</h3>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { session } = await withServerSessionGuard(ctx);

  return {
    props: {},
  };
};

export default Journal;
