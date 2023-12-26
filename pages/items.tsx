import { GetServerSideProps } from "next";

const Items = () => {
  return <h3>Items</h3>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Items;
