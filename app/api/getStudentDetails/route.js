
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const course = searchParams.get("course");
  const adm_year = searchParams.get("adm_year"); // Ensure this matches the query param in the frontend

  try {
    if (!course || !adm_year) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .query(
        `SELECT adm_year, s_name, usno, mentor,course FROM admission_master 
         WHERE course = '${course}' AND adm_year = '${adm_year}'`
      );

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
