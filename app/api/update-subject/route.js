
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    let { sub_code, sub_desc, scheme, subject_type, semester, crhrs, suborder, result_year, dean_approval } = body;

    console.log("Received fields for update:", { sub_code, sub_desc, scheme, subject_type, semester, crhrs, suborder, result_year, dean_approval });

    // Ensure sub_code is provided
    if (!sub_code) {
      return NextResponse.json(
        { error: "sub_code is required to update the subject." },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // Fetch existing record
    const selectQuery = `
      SELECT sub_desc, scheme, SUBJECT_TYPE, semester, crhrs, suborder, result_year, dean_approval
      FROM subject_master
      WHERE sub_code = @sub_code
    `;
    const existing = await pool
      .request()
      .input("sub_code", sql.NVarChar, sub_code)
      .query(selectQuery);

    if (existing.recordset.length === 0) {
      return NextResponse.json(
        { error: `No subject found with sub_code: ${sub_code}` },
        { status: 404 }
      );
    }

    const currentData = existing.recordset[0];

    // Merge existing values with provided values, ensuring strings are valid
    sub_desc = sub_desc ?? currentData.sub_desc;
    // If scheme is not provided, use existing scheme. If that is null, use an empty string
    scheme = scheme ?? currentData.scheme ?? "";
    subject_type = subject_type ?? currentData.SUBJECT_TYPE;
    semester = semester ?? currentData.semester;
    crhrs = crhrs ?? currentData.crhrs;
    suborder = suborder ?? currentData.suborder;
    result_year = result_year ?? currentData.result_year;
    dean_approval = dean_approval ?? currentData.dean_approval;

    // Validate scheme as a string. If scheme is not a string, convert it to a string.
    if (typeof scheme !== "string") {
      scheme = String(scheme);
    }

    // Parse result_year to a Date if it exists
    let resultYearDate = null;
    if (result_year) {
      resultYearDate = new Date(result_year);
      if (isNaN(resultYearDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid result_year format. Expected YYYY-MM-DD." },
          { status: 400 }
        );
      }
    }

    const updateQuery = `
      UPDATE subject_master
      SET sub_desc = @sub_desc, scheme = @scheme, SUBJECT_TYPE = @subject_type, semester = @semester,
          crhrs = @crhrs, suborder = @suborder, result_year = @result_year, dean_approval = @dean_approval
      WHERE sub_code = @sub_code
    `;

    const result = await pool
      .request()
      .input("sub_code", sql.NVarChar, sub_code)
      .input("sub_desc", sql.NVarChar, sub_desc)
      .input("scheme", sql.NVarChar, scheme) // scheme is now always a string
      .input("subject_type", sql.NVarChar, subject_type)
      .input("semester", sql.TinyInt, semester)
      .input("crhrs", sql.Int, crhrs)
      .input("suborder", sql.Int, suborder)
      .input("result_year", sql.Date, resultYearDate)
      .input("dean_approval", sql.NVarChar, dean_approval)
      .query(updateQuery);

    if (result.rowsAffected[0] > 0) {
      return NextResponse.json({ message: "Subject updated successfully." });
    } else {
      return NextResponse.json(
        { error: "Subject not found or no changes made." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/update-subject:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
