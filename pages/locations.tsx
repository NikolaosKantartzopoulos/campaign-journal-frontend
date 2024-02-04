import LocationsPage from "@/Components/Locations/LocationsPage";
import { getAllLocationsWithWorldId } from "@/clients/Locations/locationsClient";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

const Locations = () => {
  return <LocationsPage />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session } = await withServerSessionGuard(context);

  const user = session?.user;
  if (!session || !user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      `getAllLocationsInSelectedWorld`,
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: () =>
      getAllLocationsWithWorldId(Number(user.selectedWorld?.location_id)),
  });

  return {
    props: {
      session,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default Locations;
