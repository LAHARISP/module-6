

import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const department = url.searchParams.get("department"); // Retrieve the 'department' query parameter

  if (!department) {
    return NextResponse.json(
      { error: "Department is required" },
      { status: 400 }
    ); // Return error if department is not provided
  }

  try {
    const pool = await connectToDatabase(); // Connect to the database
    const result = await pool
      .request()
      .input("department", department) // Use parameterized query to prevent SQL injection
      .query(`SELECT employee_id,faculty_name from facultyPersonalDetails  WHERE department = @department`); // Query filtered by department

    console.log(result);
    return new NextResponse(JSON.stringify(result.recordset), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }); // Return the filtered result as JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}


