
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { usno, name, programType, date, event, place, level, achievement, mentor, course, no_of_days } = body;

    // Validate required fields, including no_of_days
    if (!usno || !programType || !date || !event || !place || !level || !achievement || !name || !mentor || !course || no_of_days === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Insert extracurricular details, including no_of_days
    const result = await db
      .request()
      .input("s_name", name)
      .input("usno", usno)
      .input("branch", course) // Course (branch) from frontend
      .input("event_type", programType)
      .input("event_date", date)
      .input("place", place)
      .input("event_name", event)
      .input("mentor", mentor) // Mentor from frontend
      .input("level", level)
      .input("award_received", achievement)
      .input("no_of_days", no_of_days) // Number of days added
      .query(`
        INSERT INTO Mentee_ExtraCurricular
        (s_name, usno, branch, event_type, event_date, place, event_name, mentor, level, award_received, no_of_days)
        VALUES (@s_name, @usno, @branch, @event_type, @event_date, @place, @event_name, @mentor, @level, @award_received, @no_of_days)
      `);

    if (result.rowsAffected[0] > 0) {
      console.log("Extracurricular data inserted:", {
        name,
        usno,
        course,
        programType,
        date,
        event,
        place,
        mentor,
        level,
        achievement,
        no_of_days,
      });

      return NextResponse.json(
        { message: "Extracurricular details submitted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to submit extracurricular details" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting extracurricular details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
