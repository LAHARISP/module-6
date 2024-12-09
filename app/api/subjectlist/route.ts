
// import { connectToDatabase } from "@/lib/db";
// import sql from "mssql";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     // Parse query parameters
//     const { searchParams } = new URL(req.url);
//     const semester = searchParams.get("semester");
//     const resultYear = searchParams.get("result_year");
//     const BRANCH = "CB"; // Adjusted branch constant based on your database values

//     // Validate input
//     if (!semester || !resultYear) {
//       return NextResponse.json(
//         { error: "Missing required query parameters (semester or result_year)." },
//         { status: 400 }
//       );
//     }

//     // Connect to the database
//     const pool = await connectToDatabase();
//     if (!pool) {
//       throw new Error("Failed to connect to the database.");
//     }

//     // SQL query
//     const query = `
//       SELECT 
//         sub_code, 
//         sub_desc, 
//         subject_type AS SUBJECT_TYPE, 
//         scheme, 
//         crhrs, 
//         suborder, 
//         semester, 
//         result_year, 
//         branch AS BRANCH
//       FROM subject_master
//       WHERE branch = @branch AND semester = @semester AND result_year = @resultYear
//     `;

//     const result = await pool
//       .request()
//       .input("branch", sql.NVarChar, BRANCH)
//       .input("semester", sql.Int, parseInt(semester))
//       .input("resultYear", sql.NVarChar, resultYear)
//       .query(query);

//     if (result.recordset.length > 0) {
//       return NextResponse.json(result.recordset, { status: 200 });
//     } else {
//       return NextResponse.json(
//         { message: "No subjects found for the selected criteria." },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Database error:", error.message || error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching data." },
//       { status: 500 }
//     );
//   }
// }
import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const result_year = searchParams.get("result_year");

    if (!branch || !semester || !result_year) {
      return NextResponse.json(
        { error: "Missing required query parameters: branch, semester, result_year" },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // Fetch subjects for the given branch, semester, and result_year
    const query = `
      SELECT sub_code, sub_desc, subject_type, scheme, crhrs, suborder, semester, branch, result_year
      FROM subject_master
      WHERE branch = @branch AND semester = @semester AND result_year = @result_year
    `;
    const result = await pool
      .request()
      .input("branch", sql.NVarChar(50), branch)
      .input("semester", sql.TinyInt, semester)
      .input("result_year", sql.Date, result_year)
      .query(query);

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
