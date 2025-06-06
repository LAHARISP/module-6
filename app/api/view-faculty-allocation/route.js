import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const semester = url.searchParams.get("semester");
    const resultYear = url.searchParams.get("result_year");
    const branch = url.searchParams.get("Branch");

    // Validate required parameters
    if (!semester || !resultYear || !branch) {
      return new Response(
        JSON.stringify({
          error: "Semester, Result Year, and Branch are required.",
        }),
        { status: 400 }
      );
    }

    // Convert and validate semester
    const semesterInt = parseInt(semester);
    if (isNaN(semesterInt) || semesterInt < 1 || semesterInt > 8) {
      return new Response(
        JSON.stringify({ error: "Invalid semester value." }),
        { status: 400 }
      );
    }

    // Validate result year format
    const resultYearDate = new Date(resultYear);
    if (isNaN(resultYearDate.getTime())) {
      return new Response(
        JSON.stringify({ error: "Invalid result year format." }),
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();

    // Define and execute the query
    const query = `
      SELECT 
        pky AS pky,
        result_year,
        semester,
        brcode AS branch,
        subcode AS sub_code,
        sub_desc,
        sect,
        emp_id AS employeeid,
        emp_name AS facultyname,
        suborder
      FROM subject_faculty_map
      WHERE semester = @semester 
        AND result_year = @resultYear 
        AND brcode = @branch
    `;

    const result = await pool
      .request()
      .input("semester", sql.Int, semesterInt) // Ensure semester is an integer
      .input("resultYear", sql.Date, resultYear) // Ensure resultYear is in correct date format
      .input("branch", sql.NVarChar(50), branch) // Ensure branch matches database schema
      .query(query);

    // Return the results
    return new Response(JSON.stringify(result.recordset), { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching allocations:", error);

    // Return a more detailed error for internal server errors
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error.message 
      }),
      { status: 500 }
    );
  }
}
