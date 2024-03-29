import { getUniqueLocationById } from "@/clients/Locations/locationsClient";
import { readImageFromDrive } from "@/utilities/formidable";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ItemPage from "@/Components/PresentItem/ItemPage";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

const LocationPage = ({ locationImage }: { locationImage: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <ItemPage
      itemImage={locationImage}
      queryKey={[
        "location",
        { user_id: user?.user_id },
        { location_id: router.query.location_id },
      ]}
      queryFn={async () => {
        const { data: location } = await axios(
          `/api/locations/${router.query.location_id}`
        );
        return location;
      }}
      itemSubtitle={"location.location_name"}
      itemName={"location_name"}
      prependString="part of "
      altText={"Location Image"}
      descriptionText={"location_description"}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
  const location_id = context?.params?.location_id;

  await queryClient.prefetchQuery({
    queryKey: [
      "location",
      { user_id: user?.user_id },
      { location_id: context.query.location_id },
    ],
    queryFn: () => getUniqueLocationById(Number(context.query.location_id)),
  });
  const locationImage = await readImageFromDrive(
    "locations",
    `${user.selectedWorld?.location_id}_${location_id}`
  );
  return { props: { locationImage, dehydratedState: dehydrate(queryClient) } };
};

export default LocationPage;
