import { GetServerSideProps } from "next";

const Factions = () => {
  return <h3>Factions</h3>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default Factions;
