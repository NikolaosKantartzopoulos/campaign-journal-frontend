import { GetServerSideProps } from "next";

const Locations = () => {
  return <h3>Locations</h3>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Locations;