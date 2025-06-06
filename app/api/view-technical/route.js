
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Parse the request URL to get query parameters
    const url = new URL(request.url);
    const usno = url.searchParams.get("usno");

    // Check if USN is provided in the query
    if (!usno) {
      return NextResponse.json(
        { error: "USN is required in the query parameters" },
        { status: 400 } // Bad Request
      );
    }

    // Connect to the database
    const db = await connectToDatabase();

    // Query to fetch student technical event details filtered by USN
    const result = await db
      .request()
      .input("usno", usno)
      .query(`
        SELECT 
          s_name,
          usno,
          branch,
          event_type,
          event_date,
          place,
          event_name,
          mentor,
          role,
          title_of_paper_presented,
          no_of_days -- Added column
        FROM Mentee_TechnicalEvents
        WHERE usno = @usno
      `);

    // Check if no records are found
    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          status: "success", // Success because the request was processed
          message: `No technical event records found for USN: ${usno}`,
          data: [], // Return an empty data array
        },
        { status: 200 } // OK
      );
    }

    // Respond with the retrieved records
    return NextResponse.json(
      {
        status: "success",
        message: "Technical event records retrieved successfully",
        data: result.recordset, // Include the records in the response
      },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Error fetching technical event details:", error);

    // Return a 500 Internal Server Error for unexpected errors
    return NextResponse.json(
      { error: "Failed to fetch technical event details" },
      { status: 500 }
    );
  }
}
