import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import { GetServerSideProps } from "next";

const Items = () => {
  return <h3>Items</h3>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session } = await withServerSessionGuard(context);

  return {
    props: {},
  };
};

export default Items;
