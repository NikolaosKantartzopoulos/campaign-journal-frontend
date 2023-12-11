// get the client
const mysql = require("mysql2/promise");

export async function databaseConnect() {
	// create the connection to database
	const connection = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "rpwd",
		port: 3600,
		// database: process.env.DATABASE_NAME,
		database: "campaign_journal",
	});

	return connection;
}
