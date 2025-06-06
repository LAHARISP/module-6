
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { usno, date, reason, advice, name, mentor, course } = body; // Updated field names

    // Validate required fields
    if (!usno || !date || !reason || !advice || !name || !mentor || !course) {
      console.error("Missing fields:", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Insert counselling details into the database
    const result = await db
      .request()
      .input("s_name", name)
      .input("usno", usno)
      .input("branch", course)
      .input("reason", reason) // Correctly using the "reason" field
      .input("date", date)
      .input("mentor", mentor)
      .input("advice", advice) // Correctly using the "advice" field
      .query(`
        INSERT INTO mentee_councelling
        (s_name, usno, branch, reason, date, mentor, advice)
        VALUES (@s_name, @usno, @branch, @reason, @date, @mentor, @advice)
      `);

    if (result.rowsAffected[0] > 0) {
      console.log("Counselling data inserted:", {
        name,
        usno,
        course,
        reason,
        date,
        mentor,
        advice,
      });

      return NextResponse.json(
        { message: "Counselling details submitted successfully" },
        { status: 200 }
      );
    } else {
      console.error("Insert failed:", body);
      return NextResponse.json(
        { error: "Failed to submit counselling details" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting counselling details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
