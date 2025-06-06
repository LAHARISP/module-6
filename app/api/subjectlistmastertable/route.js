
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const result_year = searchParams.get("result_year");

    if (!branch || !semester || !result_year) {
      return NextResponse.json(
        { error: "Missing required query parameters: branch, semester, result_year" },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // Fetch subjects for the given branch, semester, and result_year
    const query = `
      SELECT sub_code, sub_desc, subject_type, scheme, crhrs, suborder, semester, branch, result_year, dean_approval
      FROM subject_master
      WHERE branch = @branch AND semester = @semester AND result_year = @result_year
    `;
    const result = await pool
      .request()
      .input("branch", sql.NVarChar(50), branch)
      .input("semester", sql.TinyInt, semester)
      .input("result_year", sql.Date, result_year)
      .query(query);

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
