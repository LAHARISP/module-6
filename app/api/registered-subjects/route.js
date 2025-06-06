import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const brcode = searchParams.get("brcode");
  const result_year = searchParams.get("result_year");
  const semester = searchParams.get("semester");

  try {
    if (!brcode || !result_year || !semester) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    const query = `
      SELECT usn, s_name, subtype, subcode, crta 
      FROM course_registration 
      WHERE brcode = @brcode 
        AND result_year = @result_year 
        AND semester = @semester`;

    const result = await pool
      .request()
      .input("brcode", brcode)
      .input("result_year", result_year)
      .input("semester", semester)
      .query(query);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { brcode, subcode } = await req.json();

  try {
    if (!brcode || !subcode) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    const query = `
      DELETE FROM course_registration 
      WHERE brcode = @brcode 
        AND subcode = @subcode`;

    await pool
      .request()
      .input("brcode", brcode)
      .input("subcode", subcode)
      .query(query);

    return NextResponse.json({ message: "Entry deleted successfully." });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
