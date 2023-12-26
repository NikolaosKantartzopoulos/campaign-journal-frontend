import { GetServerSideProps } from "next";

const Journal = () => {
  return <h3>Journal</h3>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Journal;
