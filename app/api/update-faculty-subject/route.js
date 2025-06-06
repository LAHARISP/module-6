import { connectToDatabase } from "@/lib/db"; // Adjust the path based on your project structure
import sql from "mssql";
import {  NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { subjectCode, section, semester, resultYear, facultyId, facultyName } = body;

    // Validate the required fields
    if (!subjectCode || !section || !semester || !resultYear || !facultyId || !facultyName) {
      console.log("Missing required fields in the request body.");
      return NextResponse.json(
        { error: "Missing required fields: subjectCode, section, semester, resultYear, facultyId, facultyName." },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // SQL query to update the record
    const query = `
      UPDATE subject_faculty_map
      SET emp_id = @facultyId, emp_name = @facultyName, sect = @section
      WHERE subcode = @subjectCode AND result_year = @resultYear AND semester = @semester
    `;

    // Execute the query
    const result = await pool
      .request()
      .input("facultyId", sql.NVarChar, facultyId)
      .input("facultyName", sql.NVarChar, facultyName)
      .input("section", sql.NVarChar, section)
      .input("semester", sql.TinyInt, Number(semester)) // Ensure semester is passed as a number
      .input("resultYear", sql.Date, new Date(resultYear)) // Parse resultYear as a Date
      .input("subjectCode", sql.NVarChar, subjectCode)
      .query(query);

    // Check if rows were affected
    if (result.rowsAffected[0] > 0) {
      return NextResponse.json({ message: "Allocation updated successfully." });
    } else {
      return NextResponse.json(
        { error: "No allocation found for the provided details." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/update-faculty-subject:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
