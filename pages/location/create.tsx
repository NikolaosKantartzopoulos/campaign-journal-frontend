import CreateLocationPage from "@/Components/Locations/CreateLocationPage";
import { GetServerSideProps } from "next";

const CreateLocation = () => {
  return <CreateLocationPage />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default CreateLocation;
