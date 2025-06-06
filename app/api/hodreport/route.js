import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const eventType = url.searchParams.get("event_type");
    const branch = url.searchParams.get("branch");
    const fromDate = url.searchParams.get("from_date");
    const toDate = url.searchParams.get("to_date");

    if (!branch) {
      return NextResponse.json(
        { error: "Missing required query parameter: branch" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!eventType && !fromDate && !toDate) {
      // Return summary data if no filters are provided
      const summaryQuery = `
        SELECT 
          event_type,
          COUNT(*) AS total
        FROM Mentee_TechnicalEvents
        WHERE branch = @branch
        GROUP BY event_type
      `;

      const summaryResult = await db
        .request()
        .input("branch", branch)
        .query(summaryQuery);

      return NextResponse.json(
        {
          status: "success",
          message: "Summary data retrieved successfully",
          data: summaryResult.recordset,
        },
        { status: 200 }
      );
    }

    // Return detailed event records based on filters
    if (!eventType || !fromDate || !toDate) {
      return NextResponse.json(
        { error: "Missing required query parameters for event data" },
        { status: 400 }
      );
    }

    const detailQuery = `
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
      FROM Mentee_TechnicalEvents
      WHERE branch = @branch
        AND event_type = @eventType
        AND event_date BETWEEN @fromDate AND @toDate
    `;

    const detailResult = await db
      .request()
      .input("branch", branch)
      .input("eventType", eventType)
      .input("fromDate", fromDate)
      .input("toDate", toDate)
      .query(detailQuery);

    return NextResponse.json(
      {
        status: "success",
        message: "Records retrieved successfully",
        data: detailResult.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
