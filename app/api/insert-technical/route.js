import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      usno,
      name,
      branch,
      programType,
      date,
      place,
      title,
      role,
      mentor,
      no_of_days,
      title_of_paper_presented,
    } = body;

    // Validate required fields
    if (
      !usno ||
      !name ||
      !programType ||
      !date ||
      !place ||
      !title ||
      !role ||
      !no_of_days ||
      !title_of_paper_presented
    ) {
      console.error("Missing required fields", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    const result = await db
      .request()
      .input("s_name", name)
      .input("usno", usno)
      .input("branch", branch || "Unknown")
      .input("event_type", programType)
      .input("event_date", date)
      .input("place", place)
      .input("event_name", title)
      .input("mentor", mentor || "N/A")
      .input("role", role)
      .input("no_of_days", no_of_days)
      .input("title_of_paper_presented", title_of_paper_presented)
      .query(`
        INSERT INTO Mentee_TechnicalEvents
        (s_name, usno, branch, event_type, event_date, place, event_name, mentor, role, no_of_days, title_of_paper_presented)
        VALUES (@s_name, @usno, @branch, @event_type, @event_date, @place, @event_name, @mentor, @role, @no_of_days, @title_of_paper_presented)
      `);

    if (result.rowsAffected[0] > 0) {
      return NextResponse.json(
        { message: "Event submitted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to insert event" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
