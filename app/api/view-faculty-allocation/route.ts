import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const semester = url.searchParams.get("semester");
    const resultYear = url.searchParams.get("result_year");
    const brcode = url.searchParams.get("brcode");

    if (!semester || !resultYear || !brcode) {
      return new Response(
        JSON.stringify({ error: "Semester, Result Year, and Brcode are required." }),
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();

    const query = `
      SELECT PKY as pky, SUB_DESC as sub_desc, SUBCODE as sub_code, SECT as sect, FACULTYNAME as facultyname, EMPLOYEEID as employeeid
      FROM subject_faculty_map
      WHERE SEMESTER = @semester AND RESULT_YEAR = @resultYear AND BRCODE = @brcode
    `;
    const result = await pool
      .request()
      .input("semester", sql.Int, semester)
      .input("resultYear", sql.VarChar, resultYear)
      .input("brcode", sql.VarChar, brcode)
      .query(query);

    return new Response(JSON.stringify(result.recordset), { status: 200 });
  } catch (error) {
    console.error("Error fetching allocations:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
