
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
        s_name,
        usn,
        suborder,
        semester,
        subcode,
        crta,
        crte,
        grdpt,
        FORMAT(result_year, 'yyyy-MM-dd') AS result_year
      FROM [aittest].[dbo].[course_registration]
      WHERE usn = @usn AND crte > 0
      ORDER BY semester ASC, suborder ASC;
    `;

    const result = await db.request().input("usn", usn).query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { status: "success", message: `No records found for USN: ${usn}`, data: [] },
        { status: 200 }
      );
    }

    // Grouping the data by subject code and semester
    const subjectMap = new Map();

    result.recordset.forEach((course) => {
      const { subcode, semester, result_year } = course;

      // Initialize the map entry for the subject if it doesn't exist
      if (!subjectMap.has(subcode)) {
        subjectMap.set(subcode, []);
      }

      const subjectCourses = subjectMap.get(subcode);

      // Check if the course already exists for this semester and result year
      const existingCourse = subjectCourses.find(
        (existing) => existing.semester === semester && existing.result_year === result_year
      );

      if (existingCourse) {
        // Increment attempt if the subject is found
        existingCourse.attempt += 1;
      } else {
        // Otherwise, push the new course data with attempt set to 1
        subjectCourses.push({ ...course, attempt: 1 });
      }
    });

    // Flatten the courses by subject and prepare final data for response
    const processedCourses = [];
    subjectMap.forEach((courses) => {
      courses.forEach((course) => {
        processedCourses.push(course);
      });
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Student data retrieved successfully",
        data: processedCourses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Failed to fetch student data" },
      { status: 500 }
    );
  }
}
