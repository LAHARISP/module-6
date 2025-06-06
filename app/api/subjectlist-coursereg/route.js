import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import {  NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const resultYear = searchParams.get("result_year");
    const branch = searchParams.get("branch");

    if (!semester || !resultYear) {
    return NextResponse.json(
        { error: "Missing required query parameters: semester and result_year" },
        { status: 400 }
    );
    }

    const pool = await connectToDatabase();
    if (!pool) {
    throw new Error("Failed to connect to the database.");
    }

    let query = `
    SELECT 
        sub_code, 
        sub_desc, 
        scheme, 
        SUBJECT_TYPE, 
        BRANCH, 
        semester, 
        crhrs, 
        suborder, 
        result_year, 
        pky
    FROM subject_master
    WHERE semester = @semester AND result_year = @resultYear
    `;

    if (branch) {
    query += " AND BRANCH = @branch";
    }

    const request = pool
      .request()
      .input("semester", sql.TinyInt, parseInt(semester))
      .input("resultYear", sql.Date, resultYear);

    if (branch) {
      request.input("branch", sql.NVarChar(50), branch);
    }

    const result = await request.query(query);

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error("Error fetching subject list:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
