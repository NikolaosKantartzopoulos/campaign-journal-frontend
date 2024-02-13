import { CreateItemPage } from "@/Components/Items/CreateItemPage";
import { locationFullNameAndIdInterface } from "@/clients/Locations/locationsClient";
import { getLocationFullNamesAndIdsService } from "@/services/data-fetching/getLocations";
import {
  getSentientFullNamesAndIdsService,
  sentientFullNameAndId,
} from "@/services/data-fetching/getSentients";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export default function CreateItem({
  sentientNamesAndIds,
  locationNamesAndIds,
}: {
  sentientNamesAndIds: sentientFullNameAndId[];
  locationNamesAndIds: locationFullNameAndIdInterface[];
}) {
  return (
    <CreateItemPage
      sentientNamesAndIds={sentientNamesAndIds}
      locationNamesAndIds={locationNamesAndIds}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { user } = await withServerSessionGuard(ctx);

  const sentientNamesAndIds = await getSentientFullNamesAndIdsService({
    world_id: Number(user?.selectedWorld?.location_id),
  });

  const withLabelSentients =
    sentientNamesAndIds?.map((el) => ({ label: el.fullName, ...el })) || [];

  const locationNamesAndIds = await getLocationFullNamesAndIdsService({
    world_id: Number(user?.selectedWorld?.location_id),
  });

  const withLabelLocations =
    locationNamesAndIds?.map((el) => ({ label: el.location_title, ...el })) ||
    [];

  return {
    props: {
      sentientNamesAndIds: withLabelSentients,
      locationNamesAndIds: withLabelLocations,
    },
  };
};
