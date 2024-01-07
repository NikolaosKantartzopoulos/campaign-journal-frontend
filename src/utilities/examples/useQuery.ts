// import { location } from "@prisma/client";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// const user = { user_id: 1 };

// const { data: playerLocations, isLoading } = useQuery<location[]>({
//   queryKey: [`getAllWorldsThatUserHasAccess-${user?.user_id}`],
//   queryFn: async () => {
//     try {
//       const response = await axios(
//         `/api/worlds/get-all-worlds-that-user-has-access/${user?.user_id}`
//       );
//       return response.data || null;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       throw new Error("Failed to fetch data");
//     }
//   },
// enabled: !!user,
// });
