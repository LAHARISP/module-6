
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import {  NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body
    const { resultYear, semester, branchCode, subjects, section, facultyId, facultyName } = await req.json();

    // Validate required fields
    if (!resultYear || !semester || !branchCode || !subjects || !section || !facultyId || !facultyName) {
      return NextResponse.json(
        { error: "Missing required fields: resultYear, semester, branchCode, subjects, section, facultyId, facultyName" },
        { status: 400 }
      );
    }

    // Validate that `subjects` is an array of objects with `sub_code` and `sub_desc`
    if (!Array.isArray(subjects) || subjects.some(subject => !subject.sub_code || !subject.sub_desc)) {
      return NextResponse.json(
        { error: "Subjects must be an array of objects with 'sub_code' and 'sub_desc'." },
        { status: 400 }
      );
    }

    // Establish database connection
    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // Begin transaction
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Insert each subject into the database
      for (const subject of subjects) {
        const { sub_code, sub_desc } = subject;

        // Generate a unique `pky` value if required (e.g., use a GUID or similar mechanism)
        const pky = new Date().getTime().toString(); // Example: Generate a unique value based on timestamp

        await transaction.request()
          .input("pky", sql.NVarChar, pky)
          .input("resultYear", sql.Date, resultYear)
          .input("semester", sql.TinyInt, parseInt(semester))
          .input("branchCode", sql.NVarChar, branchCode)
          .input("sub_code", sql.NVarChar, sub_code)
          .input("sub_desc", sql.NVarChar, sub_desc)
          .input("section", sql.NVarChar, section)
          .input("facultyId", sql.NVarChar, facultyId)
          .input("facultyName", sql.NVarChar, facultyName)
          .query(`
            INSERT INTO subject_faculty_map (
              pky, result_year, semester, brcode, subcode, sub_desc, sect, emp_id, emp_name
            ) VALUES (
              @pky, @resultYear, @semester, @branchCode, @sub_code, @sub_desc, @section, @facultyId, @facultyName
            )
          `);
      }

      // Commit transaction
      await transaction.commit();

      return NextResponse.json({ message: "Data inserted successfully." }, { status: 200 });
    } catch (error) {
      await transaction.rollback(); // Rollback transaction on error
      throw error;
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
