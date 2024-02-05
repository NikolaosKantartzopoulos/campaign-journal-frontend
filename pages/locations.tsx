import LocationsPage from "@/Components/Locations/LocationsPage";
import {
  getAllLocationsWithWorldId,
  locationAndPartOfLocationIncluded,
} from "@/clients/Locations/locationsClient";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

const Locations = ({
  worldLocations,
}: {
  worldLocations: locationAndPartOfLocationIncluded[];
}) => {
  return <LocationsPage worldLocations={worldLocations} />;
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

  const worldLocations = await getAllLocationsWithWorldId(
    Number(user.selectedWorld?.location_id)
  );

  return {
    props: {
      session,
      worldLocations,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default Locations;
