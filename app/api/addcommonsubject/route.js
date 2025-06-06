import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { subjects } = body;

    // Validate input
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing subjects data. Ensure `subjects` is a non-empty array." },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    for (const subject of subjects) {
      // Validate required fields
      if (
        !subject.sub_code ||
        !subject.sub_desc ||
        !subject.subject_type ||
        !subject.scheme ||
        !subject.crhrs ||
        !subject.suborder ||
        !subject.semester ||
        !subject.branch ||
        !subject.result_year
      ) {
        return NextResponse.json(
          { error: `Missing or invalid data in subject: ${JSON.stringify(subject)}` },
          { status: 400 }
        );
      }

      // Format result_year to ISO format
      const formattedResultYear = new Date(subject.result_year).toISOString().split("T")[0];

      // Check if the subject already exists
      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM subject_master
        WHERE sub_code = @sub_code 
          AND semester = @semester 
          AND branch = @branch 
          AND result_year = @result_year
      `;
      const result = await pool
        .request()
        .input("sub_code", sql.NVarChar(50), subject.sub_code)
        .input("semester", sql.TinyInt, subject.semester)
        .input("branch", sql.NVarChar(50), subject.branch)
        .input("result_year", sql.Date, formattedResultYear)
        .query(checkQuery);

      const subjectExists = result.recordset[0]?.count > 0;

      if (subjectExists) {
        console.log(
          `Subject ${subject.sub_code} already exists for semester ${subject.semester}, branch ${subject.branch}. Skipping...`
        );
        continue; // Skip inserting if the subject already exists
      }

      // Insert the subject into the database
      await pool
        .request()
        .input("sub_code", sql.NVarChar, subject.sub_code)
        .input("sub_desc", sql.NVarChar, subject.sub_desc)
        .input("subject_type", sql.NVarChar, subject.subject_type)
        .input("scheme", sql.SmallInt, subject.scheme)
        .input("crhrs", sql.TinyInt, subject.crhrs)
        .input("suborder", sql.TinyInt, subject.suborder)
        .input("semester", sql.TinyInt, subject.semester)
        .input("branch", sql.NVarChar, subject.branch)
        .input("result_year", sql.Date, formattedResultYear)
        .query(`
          INSERT INTO subject_master (sub_code, sub_desc, subject_type, scheme, crhrs, suborder, semester, branch, result_year)
          VALUES (@sub_code, @sub_desc, @subject_type, @scheme, @crhrs, @suborder, @semester, @branch, @result_year)
        `);
    }

    return NextResponse.json({ message: "Subjects added successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error adding subjects:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
