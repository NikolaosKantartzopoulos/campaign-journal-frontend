// import { getAPISession } from "@/utilities/functions/getServerSideSession";
// import { NextApiRequest, NextApiResponse } from "next";

// import logger from "@/logger/*";

// export default async function apiHandler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "GET") {
//     const item = await getUniqueItemByIdService(
//       Number(req.query.item_id)
//     );
//     res.status(200).json(item);
//     return;
//   }

//   if (req.method === "PATCH") {
//     try {
//       await getAPISession(req, res);

//       const newData = await editItemService({
//         item_id: Number(req.query.item_id),
//         item_name: req.body.item_name,
//         item_description: req.body.item_description,
//         item_owner: req.body.item_owner,
//         item_location: req.body.item_location
//       });

//       res.status(200).json({ message: "Item updated" });
//       return;
//     } catch (err) {
//       logger.error("[Items API]: Item failed to update");
//     }
//   }

//   if (req.method === "DELETE") {
//     try {
//       logger.info("[Items API]: Delete item called");

//       const { user } = await getAPISession(req, res);
//       if (!user || !user?.location_id) {
//         res.status(401);
//         return;
//       }
//       if (!req.query.item_id) {
//         res.status(400);
//         return;
//       }
// await deleteItemService({item_id: Number(req.query.item_id)})

//       res.status(200).json({ message: "Item deleted" });
//       return;
//     } catch (err) {
//       logger.error("[Items API]: Failed to delete item", err);
//     }
//   }
// }
