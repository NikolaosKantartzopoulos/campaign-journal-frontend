import { useRouter } from "next/router";
import { useLoggedInUser } from "./useLoggedInUser";

export async function useWithAuth() {
	const router = useRouter();
	const userCtx = await useLoggedInUser();
	if (userCtx?.user) {
		return userCtx;
	}
	router.replace("/");
	return userCtx;
}
