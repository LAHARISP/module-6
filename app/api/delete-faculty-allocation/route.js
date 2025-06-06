import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const resultYear = url.searchParams.get("resultYear");
    const semester = url.searchParams.get("semester");
    const branchCode = url.searchParams.get("branchCode");
    const subjectCode = url.searchParams.get("subjectCode");
    const section = url.searchParams.get("section");

    // Log all received parameters
    console.log("Parameters received in DELETE request:", {
      resultYear,
      semester,
      branchCode,
      subjectCode,
      section,
    });

    // Validate required parameters
    if (!resultYear || !semester || !branchCode || !subjectCode || !section) {
      console.error("Missing required parameters:", {
        resultYear: resultYear || "Missing",
        semester: semester || "Missing",
        branchCode: branchCode || "Missing",
        subjectCode: subjectCode || "Missing",
        section: section || "Missing",
      });
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: resultYear, semester, branchCode, subjectCode, or section.",
        }),
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    if (!pool) {
      console.error("Failed to connect to the database.");
      return new Response(
        JSON.stringify({ error: "Failed to connect to the database." }),
        { status: 500 }
      );
    }

    console.log("Database connection successful.");

    // SQL Query to delete the record
    const query = `
      DELETE FROM subject_faculty_map
      WHERE result_year = @resultYear 
        AND semester = @semester 
        AND brcode = @branchCode
        AND subcode = @subjectCode
        AND sect = @section
    `;

    console.log("Executing SQL query for deletion...");

    const result = await pool
      .request()
      .input("resultYear", sql.Date, resultYear)
      .input("semester", sql.TinyInt, parseInt(semester))
      .input("branchCode", sql.NVarChar(50), branchCode)
      .input("subjectCode", sql.NVarChar(50), subjectCode)
      .input("section", sql.NVarChar(50), section)
      .query(query);

    console.log("Query executed. Rows affected:", result.rowsAffected[0]);

    if (result.rowsAffected[0] === 0) {
      console.warn("No allocation found for the provided details.");
      return new Response(
        JSON.stringify({ error: "Allocation not found for the provided details." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Allocation deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting allocation:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

