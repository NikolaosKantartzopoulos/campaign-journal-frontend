import { databaseConnect } from "../../../../utilities/databaseConnect";
import { NextRequest, NextResponse } from "next/server";
import { Sentient } from "../../../../utilities/interfaces/main";

export async function GET(req: NextRequest) {
	const connection = await databaseConnect();
	try {
		// simple query
		const [rows, fields] = await connection.execute("SELECT * FROM sentients");

		console.log(rows);

		return NextResponse.json(rows as Sentient[]);
	} finally {
		connection.end();
	}
}
