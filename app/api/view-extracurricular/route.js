import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usno = searchParams.get("usno");

    if (!usno) {
      return NextResponse.json(
        { error: "USN is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Fetch student extracurricular details filtered by USN
    const result = await db
      .request()
      .input("usno", usno)
      .query(`
        SELECT s_name, usno, branch, event_type, event_date, place, event_name, mentor, level, award_received,no_of_days
        FROM Mentee_ExtraCurricular
        WHERE usno = @usno
      `);

      

      if (result.recordset.length === 0) {
        return NextResponse.json(
          {
            status: "success", // Success because the request was processed
            message: `No councelling records found for USN: ${usno}`,
            data: [], // Return an empty data array
          },
          { status: 200 } // OK
        );
      }
      
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "No records found for this student" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.recordset, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching extracurricular data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
