
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const usno = url.searchParams.get("usno");

    // Validate if `usno` is provided
    if (!usno) {
      return NextResponse.json(
        { error: "USN is required" },
        { status: 400 }
      );
    }

    // Establish a database connection
    const db = await connectToDatabase();

    // Fetch counselling details for the specific USN
    const result = await db
      .request()
      .input("usno", usno)
      .query(`
        SELECT 
          s_name, 
          usno, 
          branch, 
          reason,
          advice, 
          date, 
          mentor 
        FROM aittest.dbo.mentee_councelling
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
    // Check if records are found
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "No counselling records found for the student" },
        { status: 404 }
      );
    }

    // Return the fetched records
    return new NextResponse(JSON.stringify(result.recordset), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching counselling details:", error);
    return NextResponse.json(
      { error: "Failed to fetch counselling details" },
      { status: 500 }
    );
  }
}
