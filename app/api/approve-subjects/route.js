import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body
    const { branch, semester, resultYear, subjects } = await req.json();

    // Validate input
    if (!branch || !semester || !resultYear || !subjects || subjects.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters or no subjects selected." },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await connectToDatabase();
    if (!pool) throw new Error("Failed to connect to the database.");

    // Loop through the selected subjects and update their dean_approval status
    for (const subCode of subjects) {
      await pool
        .request()
        .input("branch", sql.NVarChar(50), branch)
        .input("semester", sql.TinyInt, parseInt(semester))
        .input("resultYear", sql.Date, resultYear)
        .input("subCode", sql.NVarChar(50), subCode)
        .query(`
          UPDATE subject_master
          SET dean_approval = 'yes'
          WHERE branch = @branch
            AND semester = @semester
            AND result_year = @resultYear
            AND sub_code = @subCode
        `);
    }

    // Send success response
    return NextResponse.json({ message: "Subjects approved successfully." });
  } catch (error) {
    console.error("Error in POST /api/approve-subjects:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
