import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Extract query parameters from the URL
    const url = new URL(request.url);
    const mentor = url.searchParams.get("mentor");
    const eventType = url.searchParams.get("event_type");
    const fromDate = url.searchParams.get("from_date");
    const toDate = url.searchParams.get("to_date");

    // Validate required query parameters
    if (!mentor || !eventType || !fromDate || !toDate) {
      return NextResponse.json(
        { error: "Missing required query parameters (mentor, event_type, from_date, to_date)" },
        { status: 400 }
      );
    }

    // Connect to the database
    const db = await connectToDatabase();

    // SQL query to fetch data
    const query = `
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
        no_of_days
      FROM [aittest].[dbo].[Mentee_TechnicalEvents]
      WHERE mentor = @mentor
        AND event_type = @eventType
        AND event_date BETWEEN @fromDate AND @toDate
    `;

    // Execute the query
    const result = await db
      .request()
      .input("mentor", mentor)
      .input("eventType", eventType)
      .input("fromDate", fromDate)
      .input("toDate", toDate)
      .query(query);

    // Respond with the retrieved records
    return NextResponse.json(
      {
        status: "success",
        message: "Records retrieved successfully",
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching records:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
