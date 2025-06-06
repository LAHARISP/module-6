import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const usno = url.searchParams.get("usno"); // Retrieve USN from query params

  try {
    const pool = await connectToDatabase(); // Connect to the database
    let query = `
      SELECT usno, s_name, f_name, m_name, dob, gender, st_email, st_mobile,
      parent_mobile, gardian_mobile, blood_group, adhar_no, f_occupation,
      annual_income, nationality, religion, caste, category, permanent_adrs, local_adrs,mentor,course
      FROM admission_master
    `;

    // Filter by USN if provided
    if (usno) {
      query += ` WHERE usno = @usno`;
    }

    const request = pool.request();
    if (usno) {
      request.input("usno", usno);
    }

    const result = await request.query(query);
    console.log(result);

    return new NextResponse(JSON.stringify(result.recordset), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
