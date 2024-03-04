import { getAllItemsService } from "@/services/data-fetching/getItems";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";
import { GetServerSideProps } from "next";

const Items = () => {
  // return <ItemsPage items={items} />;
  return <div>Items Page</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user } = await withServerSessionGuard(context);

  const items = await getAllItemsService({
    world_id: Number(user?.selectedWorld?.location_id),
  });

  return {
    props: { items: [] },
  };
};

export default Items;
