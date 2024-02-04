import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import { GetServerSideProps } from "next";

const EditLocation = () => {
  return <div>EditLocation</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { session } = await withServerSessionGuard(ctx);
  return {
    props: {},
  };
};

export default EditLocation;
