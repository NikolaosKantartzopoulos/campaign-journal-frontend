import { GetServerSideProps } from "next";

const ManageLocation = () => {
  return <div>ManageLocation</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default ManageLocation;
