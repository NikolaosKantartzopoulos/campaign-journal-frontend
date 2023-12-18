import { ReactNode, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import UserContext from "@/Context/UserContext";
import UserControlScreen from "../Authentication/UserControlScreen";

export default function Layout({ children }: { children: ReactNode }) {
	const userCtx = useContext(UserContext);
	return (
		<>
			<Navbar />
			{userCtx?.showUserControlScreen ? <UserControlScreen /> : children}
		</>
	);
}
