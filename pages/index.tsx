import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Sentient } from "../utilities/interfaces/main";

export default function Home() {
	const [sentients, setSentients] = useState<Sentient[]>([]);

	async function fetchCharacters() {
		const { data }: { data: Sentient[] } =
			(await axios.get("/api/sentients")) ?? [];
		setSentients(data);
		console.log(data);
	}

	return (
		<main>
			<h1>Welcome to Castle, accessible by WLAN</h1>
			{/* <h2>{process.env.TEST_VAR}</h2> */}
			<Button variant="contained" size="small" onClick={fetchCharacters}>
				Get characters!
			</Button>
			{sentients && (
				<ol>
					{sentients.map((el) => (
						<li key={el.firstName}>
							{el.firstName} {el.lastName}
						</li>
					))}
				</ol>
			)}
		</main>
	);
}
