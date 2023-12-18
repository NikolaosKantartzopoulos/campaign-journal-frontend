import axios from "axios";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState,
} from "react";

export interface User {
	userId: number;
	userName: string;
	userEmail: string;
}

export interface UserContext {
	user: User | null;
	showUserControlScreen: boolean;
	setShowUserControlScreen: Dispatch<SetStateAction<boolean>>;
	logoutUser: () => void;
	createUser: (userName: string, userEmail: string) => Promise<void>;
	loginUser: (userName: string, userEmail: string) => Promise<void>;
	editUser: (
		userId: number,
		userName: string,
		userEmail: string
	) => Promise<void>;
}

const UserContext = createContext<UserContext | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [showUserControlScreen, setShowUserControlScreen] =
		useState<boolean>(false);

	async function logoutUser() {
		setUser(null);
	}

	async function createUser(
		userName: string,
		userEmail: string
	): Promise<void> {
		try {
			const response = await axios.post("/api/user-management", {
				userName,
				userEmail,
			});
			// Handle the response or any subsequent logic here
		} catch (error) {
			// Handle errors here
			console.error("Error creating user:", error);
		}
	}

	async function loginUser(userName: string, userEmail: string): Promise<void> {
		try {
			const response = await axios.put("/api/user-management", {
				userName,
				userEmail,
			});
		} catch (error) {
			// Handle errors here
			console.error("Error creating user:", error);
		}
	}

	async function editUser(
		userId: number,
		userName: string,
		userEmail: string
	): Promise<void> {
		try {
			const response = await axios.patch("/api/user-management", {
				userId,
				userName,
				userEmail,
			});
			// Handle the response or any subsequent logic here
		} catch (error) {
			// Handle errors here
			console.error("Error editing user:", error);
		}
	}

	return (
		<UserContext.Provider
			value={{
				user,
				showUserControlScreen,
				setShowUserControlScreen,
				logoutUser,
				createUser,
				editUser,
				loginUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export default UserContext;
