import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const adm_year = url.searchParams.get("adm_year"); // Retrieve admission year from query params
  const mentor = url.searchParams.get("mentor"); // Retrieve mentor from query params

  if (!mentor) {
    return NextResponse.json(
      { error: "Mentor parameter is required" },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDatabase(); // Connect to the database

    const query = `
      SELECT usno, s_name, adm_year, mentor, graduated_flag
      FROM admission_master
      WHERE adm_year = @adm_year AND mentor = @mentor AND graduated_flag IS NULL
    `;

    const result = await pool
      .request()
      .input("adm_year", adm_year)
      .input("mentor", mentor)
      .query(query);

    return new NextResponse(JSON.stringify(result.recordset), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
