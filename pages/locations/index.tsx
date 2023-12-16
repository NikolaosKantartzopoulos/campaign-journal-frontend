"use server";

import { Box, Button, Typography } from "@mui/material";
import { prisma } from "../../prisma/prisma";
import { useState } from "react";
import { Sentient } from "../../utilities/interfaces/main";

const Locations = async ({ character }: { character: Sentient }) => {
	const [sentient, setSentient] = useState<Sentient>(character);

	function getCharacters() {
		console.log("dis");
	}

	return (
		<Box>
			<Typography variant="h1">Locations</Typography>
			<Button onClick={getCharacters}>Get</Button>
			{sentient && <p>{sentient.firstName}</p>}
		</Box>
	);
};

// export async function getServerSideProps() {
// 	const character =
// 		(await prisma.sentients.findFirst({
// 			where: {
// 				firstName: "Kiera",
// 			},
// 		})) || {};

// 	return { props: { character } };
// }

export default Locations;
