import { getUniqueSentientById } from "@/services/data-fetching/getSentients";
import { readImageFromDrive } from "@/utilities/formidable";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import axios from "axios";
import ItemPage from "@/Components/PresentItem/ItemPage";

const Character = ({ characterImage }: { characterImage: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <ItemPage
      itemImage={characterImage}
      queryKey={[
        "sentient",
        { user_id: user?.user_id },
        { world_id: user?.selectedWorld?.location_id },
        { sentient_id: router.query.sentient_id },
      ]}
      queryFn={async () => {
        const { data: sentient } = await axios(
          `/api/sentients/unique/${router.query.sentient_id}`
        );
        return sentient;
      }}
      itemSubtitle={"short_title"}
      itemName={"sentient_full_name"}
      altText={"Character Image"}
      descriptionText={"sentient_description"}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;
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
  const sentient_id = context?.params?.sentient_id;

  await queryClient.prefetchQuery({
    queryKey: [
      "sentient",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
      { sentient_id: context.query.sentient_id },
    ],
    queryFn: () => getUniqueSentientById(Number(context.query.sentient_id)),
  });

  const characterImage = await readImageFromDrive(
    "characters",
    `${user.selectedWorld?.location_id}_${sentient_id}`
  );

  return { props: { characterImage, dehydratedState: dehydrate(queryClient) } };
};

export default Character;
