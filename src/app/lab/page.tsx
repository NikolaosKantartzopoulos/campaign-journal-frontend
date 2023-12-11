import {
	Button,
	Card,
	CardActions,
	CardContent,
	Typography,
} from "@mui/material";
import React from "react";

type Props = {};

function Lab({}: Props) {
	return (
		<div>
			<h1>This is the Lab Page</h1>
			<Card variant="outlined">I want to play Dungeons & Dragons</Card>
			<Card sx={{ minWidth: 275 }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Word of the Day
					</Typography>
					<Typography variant="h5" component="div">
						I want to play Dungeons & Dragons
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						adjective
					</Typography>
					<Typography variant="body2">
						well meaning and kindly.
						<br />
						{'"a benevolent smile"'}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
}

export default Lab;
