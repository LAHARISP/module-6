

import { connectToDatabase } from "@/lib/db"; // Import the database connection function
import sql from "mssql";
import {  NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { branch, subjectType, subjectCode, subjectName, credits, semester } = body;

    // Validate the input
    if (!branch || !subjectType || !subjectCode || !subjectName || !credits || !semester) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // Insert the subject mapping record into the database
    const query = `
      INSERT INTO SubjectMapping (branch, subject_type, subject_code, subject_name, credits, semester)
      VALUES (@branch, @subjectType, @subjectCode, @subjectName, @credits, @semester)
    `;

    const result = await pool
      .request()
      .input("branch", sql.NVarChar, branch)
      .input("subjectType", sql.NVarChar, subjectType)
      .input("subjectCode", sql.NVarChar, subjectCode)
      .input("subjectName", sql.NVarChar, subjectName)
      .input("credits", sql.Int, credits)
      .input("semester", sql.Int, semester)
      .query(query);

    // Check if the insertion was successful
    if (result.rowsAffected[0] > 0) {
      return NextResponse.json(
        { message: "Subject added successfully." },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to add the subject." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

