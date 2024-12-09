import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    console.log("Received Payload:", body); // Log the incoming payload

    const {
      resultYear,
      semester,
      branchCode,
      subjects,
      section,
      facultyId,
    } = body;

    // Validate the payload
    if (
      !resultYear ||
      !semester ||
      !branchCode ||
      !subjects ||
      subjects.length === 0 ||
      !section ||
      !facultyId
    ) {
      console.error("Validation Error: Missing mandatory fields.");
      return NextResponse.json(
        { error: "All mandatory fields are required." },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await connectToDatabase();
    console.log("Database connected successfully");

    // Fetch faculty details
    const facultyQuery = `
      SELECT fname, department, designation 
      FROM faculty_table
      WHERE fid = @facultyId
    `;
    const facultyResult = await pool
      .request()
      .input("facultyId", sql.VarChar, facultyId)
      .query(facultyQuery);

    if (facultyResult.recordset.length === 0) {
      console.error("Faculty not found for ID:", facultyId);
      return NextResponse.json(
        { error: "Faculty not found." },
        { status: 404 }
      );
    }

    const { fname: facultyName } = facultyResult.recordset[0];
    console.log("Faculty found:", facultyName);

    // Fetch subject details
    const subjectQuery = `
      SELECT sub_code, sub_desc
      FROM subject_table
      WHERE sub_code IN (${subjects.map((_, index) => `@subCode${index}`).join(",")})
    `;
    const subjectRequest = pool.request();
    subjects.forEach((subCode, index) => {
      subjectRequest.input(`subCode${index}`, sql.VarChar, subCode);
    });

    const subjectResult = await subjectRequest.query(subjectQuery);

    if (subjectResult.recordset.length === 0) {
      console.error("Subjects not found for provided codes:", subjects);
      return NextResponse.json(
        { error: "Subjects not found." },
        { status: 404 }
      );
    }

    console.log("Subjects found:", subjectResult.recordset);

    // Begin transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert data for each subject
      for (const subject of subjectResult.recordset) {
        console.log("Inserting subject:", subject.sub_code); // Log each insert
        const query = `
          INSERT INTO subject_faculty_map 
          (RESULT_YEAR, SEMESTER, BRCODE, SUBCODE, SECT, SUB_DESC, EMPLOYEEID, FACULTYNAME, sub_type)
          VALUES (@resultYear, @semester, @branchCode, @subCode, @section, @subDesc, @facultyId, @facultyName, NULL)
        `;

        await transaction.request()
          .input("resultYear", sql.VarChar, resultYear)
          .input("semester", sql.Int, semester)
          .input("branchCode", sql.VarChar, branchCode)
          .input("subCode", sql.VarChar, subject.sub_code)
          .input("section", sql.VarChar, section)
          .input("subDesc", sql.VarChar, subject.sub_desc || null)
          .input("facultyId", sql.VarChar, facultyId)
          .input("facultyName", sql.VarChar, facultyName)
          .query(query);
      }

      // Commit transaction
      await transaction.commit();
      console.log("Transaction committed successfully");

      return NextResponse.json(
        { message: "Data inserted successfully!" },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error("Transaction error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error. Check the server logs for details." },
      { status: 500 }
    );
  }
}
