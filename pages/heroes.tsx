import { AddHeroContextProvider } from "@/Components/Heroes/AddHeroContext";
import AddHeroPage from "@/Components/Heroes/AddHeroPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";

const Heroes = () => {
  const { data: sentients } = useQuery({
    queryKey: ["allSentients"],
    queryFn: async () => {
      const { data: sentient } = await axios("/api/sentients/");
      return sentient;
    },
  });

  return (
    <AddHeroContextProvider>
      <AddHeroPage sentients={sentients} />
    </AddHeroContextProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Heroes;
