import Box from "@mui/material/Box";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Card } from "@mui/material";
import { readImageFromDrive } from "@/utilities/formidable";
import { location } from "@prisma/client";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import ImageUploader from "@/Components/CustomComponents/ImageUploader";

export default function ManageLocation({
  locationImage,
}: {
  locationImage: string;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const { data: location, isFetched } = useQuery<location>({
    queryKey: [
      "location",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { location_id: router.query.location_id },
    ],
    queryFn: async () => {
      const { data: location } = await axios(
        `/api/locations/${router.query.location_id}`
      );
      return location;
    },
    enabled: !!user,
  });
  console.log(location);
  return (
    <Box sx={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
      <Card
        sx={{
          maxWidth: "500px",
          margin: "1rem auto",
          p: "1rem",
          minHeight: "405px",
          display: "flex",
          flexDirection: "column",
          alignItems: "space-between",
        }}
      >
        <Box sx={{ flexGrow: "1" }}>
          {isFetched && (
            <Box>
              {/* <CharacterBasicInfo /> */}
              {location?.location_name}
              <ImageUploader
                currentImageFile={locationImage}
                queryKey={[
                  "location",
                  { user_id: user?.user_id },
                  { world_id: user?.selectedWorld?.location_id },
                  { location_id: router.query.location_id },
                ]}
                queryFn={async () => {
                  const { data: location } = await axios(
                    `/api/locations/${router.query.location_id}`
                  );
                  return location;
                }}
                postUrl={`/api/files/locations/${location?.location_id}`}
                deleteUrl={`/api/files/locations/${location?.location_id}`}
              />
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { user } = await withServerSessionGuard(ctx);
  const queryClient = new QueryClient();
  const location_id = ctx?.params?.location_id;

  const locationImage = await readImageFromDrive(
    "locations",
    `${user?.selectedWorld?.location_id}_${location_id}`
  );

  return { props: { locationImage, dehydratedState: dehydrate(queryClient) } };
};
