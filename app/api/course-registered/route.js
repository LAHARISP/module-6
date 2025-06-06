import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const usn = url.searchParams.get("usn");

    if (!usn) {
      return NextResponse.json(
        { error: "USN is required in the query parameters" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    const query = `
      SELECT 
        semester,
        subcode,
        crta,
        crte,
        grdpt,
        result_year,
        ROW_NUMBER() OVER (
          PARTITION BY subcode, semester
          ORDER BY result_year DESC
        ) AS attempt
      FROM [aittest].[dbo].[course_registration]
      WHERE usn = @usn
      ORDER BY semester ASC, subcode ASC;
    `;

    const result = await db.request().input("usn", usn).query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { semesters: [] },
        { status: 200 }
      );
    }

    // Group data by semester and calculate SGPA
    const semesterMap = new Map();

    result.recordset.forEach((course) => {
      const semester = course.semester;

      if (!semesterMap.has(semester)) {
        semesterMap.set(semester, {
          semester,
          courses: [],
          semesterCredits: 0,
          semesterGradePoints: 0,
          sgpa: 0,
        });
      }

      const semesterData = semesterMap.get(semester);
      semesterData.courses.push(course);

      // Calculate semester credits and grade points for SGPA
      if (course.crte > 0 && course.grdpt > 0) {
        semesterData.semesterCredits += course.crte;
        semesterData.semesterGradePoints += course.crte * course.grdpt;
      }
    });

    // Calculate SGPA for each semester
    semesterMap.forEach((semData) => {
      semData.sgpa = semData.semesterCredits
        ? semData.semesterGradePoints / semData.semesterCredits
        : 0;
    });

    return NextResponse.json(
      { semesters: Array.from(semesterMap.values()) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}
