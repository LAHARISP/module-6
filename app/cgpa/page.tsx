
"use client"
import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

//const usn: string = "1DA22IS020"; // USN constant
const usn: string = "1DA22IS009"; // USN constant

interface Course {
  semester: number;
  subcode: string;
  crta: number; // Credits Actual
  crte: number; // Credits Earned
  grdpt: number; // Grade Points
  result_year: string; // Result Year
  attempt: number; // Number of attempts for the subject
}

interface SemesterData {
  semester: number;
  courses: Course[];
  semesterCredits: number;
  semesterGradePoints: number;
  sgpa: number; // Semester GPA
  cgpa: number; // Cumulative GPA up to the current semester
}

// Function to format date to YYYY-MM-DD
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "N/A"; // Validate date before formatting
};

const StudentResults: React.FC = () => {
  const [studentName, setStudentName] = useState<string>(""); // Student Name
  const [semesters, setSemesters] = useState<SemesterData[]>([]); // All semester data
  const [error, setError] = useState<string>(""); // Error message

  // Fetch student data from API
  const fetchStudentData = async () => {
    try {
      const response = await fetch(`/api/cgpa?usn=${usn}`); // Fetch data dynamically using USN
      const result = await response.json();

      if (result.status === "success" && result.data.length > 0) {
        const data = result.data;

        // Extract student name
        setStudentName(data[0].s_name);

        // Group data by semester and calculate SGPA and CGPA
        const groupedSemesters: SemesterData[] = [];
        const semesterMap = new Map();

        let cumulativeCredits = 0;
        let cumulativeGradePoints = 0;

        data.forEach((course: Course) => {
          if (!semesterMap.has(course.semester)) {
            semesterMap.set(course.semester, {
              semester: course.semester,
              courses: [],
              semesterCredits: 0,
              semesterGradePoints: 0,
              sgpa: 0,
              cgpa: 0, // Initialize CGPA for each semester
            });
          }

          const semesterData = semesterMap.get(course.semester);

          // Format result year before processing course
          course.result_year = formatDate(course.result_year);

          // Handle duplicate subject codes: Keep the most recent result_year and increment attempts
          const existingCourseIndex = semesterData.courses.findIndex(
            (c) => c.subcode === course.subcode
          );

          if (existingCourseIndex !== -1) {
            const existingCourse = semesterData.courses[existingCourseIndex];
            if (new Date(course.result_year) > new Date(existingCourse.result_year)) {
              semesterData.courses[existingCourseIndex] = {
                ...course,
                attempt: existingCourse.attempt + 1, // Increment attempts properly
              };
            } else {
              // If older result_year is retained, increment attempt count
              semesterData.courses[existingCourseIndex].attempt += 1;
            }
          } else {
            // Start with attempt = 1 for new subjects
            course.attempt = 1;
            semesterData.courses.push(course);
          }

          // Only consider courses with valid credits earned and grade points for SGPA/CGPA calculations
          if (course.crte > 0 && course.grdpt > 0) {
            semesterData.semesterCredits += course.crte;
            semesterData.semesterGradePoints += course.crte * course.grdpt;
          }
        });

        // Calculate SGPA and CGPA for each semester
        semesterMap.forEach((semData) => {
          const { semesterCredits, semesterGradePoints } = semData;

          // Calculate SGPA for the semester
          semData.sgpa = semesterCredits ? semesterGradePoints / semesterCredits : 0;

          // Update cumulative totals
          cumulativeCredits += semesterCredits;
          cumulativeGradePoints += semesterGradePoints;

          // Calculate CGPA up to the current semester
          semData.cgpa = cumulativeCredits
            ? cumulativeGradePoints / cumulativeCredits
            : 0;

          groupedSemesters.push(semData);
        });

        // Sort semesters in ascending order
        groupedSemesters.sort((a, b) => a.semester - b.semester);

        setSemesters(groupedSemesters);
      } else {
        setError(result.message || "No data available");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student data");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col">
        <Sidebar />
        <main className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-black">Student Results</h1>

          {error && <p className="text-red-500">{error}</p>}

          {!error && (
            <>
              {/* Student Info */}
              <div className="mb-6 p-4 bg-gray-100 rounded shadow text-black">
                <p>
                  <strong>Name:</strong> {studentName}
                </p>
                <p>
                  <strong>USN:</strong> {usn}
                </p>
              </div>

              {/* Semester Results */}
              {semesters.map((sem, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-lg font-medium text-black">Semester {sem.semester}</h2>
                  <table className="w-full mt-2 border-collapse border border-gray-300">
                    <thead>
                      <tr className="text-black">
                        <th className="border border-gray-300 p-2">Subject Code</th>
                        <th className="border border-gray-300 p-2">Credits (Actual)</th>
                        <th className="border border-gray-300 p-2">Credits (Earned)</th>
                        <th className="border border-gray-300 p-2">Grade Points</th>
                        <th className="border border-gray-300 p-2">Result Year</th>
                        <th className="border border-gray-300 p-2">Attempt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.courses.map((course, courseIndex) => (
                        <tr key={courseIndex} className="text-black">
                          <td className="border border-gray-300 p-2">{course.subcode}</td>
                          <td className="border border-gray-300 p-2">{course.crta}</td>
                          <td className="border border-gray-300 p-2">{course.crte}</td>
                          <td className="border border-gray-300 p-2">{course.grdpt}</td>
                          <td className="border border-gray-300 p-2">{course.result_year}</td>
                          <td className="border border-gray-300 p-2">{course.attempt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* SGPA and CGPA Section */}
                  <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                    <p className="text-black">
                      <strong>SGPA:</strong> {sem.sgpa.toFixed(2)}
                    </p>
                    <p className="text-black">
                      <strong>CGPA:</strong> {sem.cgpa.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentResults;
