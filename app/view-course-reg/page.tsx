"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

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

const ViewCourseRegistered: React.FC = () => {
  const searchParams = useSearchParams(); // Get query parameters
  const usn = searchParams.get("usno") || ""; // Get USN dynamically from query params
  const studentName = searchParams.get("s_name") || ""; // Get student name dynamically from query params

  const [semesters, setSemesters] = useState<SemesterData[]>([]); // Semester data
  const [error, setError] = useState<string>(""); // Error message
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch course registration data from the API
  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/course-registered?usn=${usn}`);
      if (!response.ok) throw new Error("Failed to fetch course data.");

      const result = await response.json();
      if (result.status === "success" && result.semesters.length > 0) {
        setSemesters(result.semesters);
      } else {
        setError(result.message || "No data available.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch course data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usn) fetchCourseData();
    else setError("Invalid USN.");
  }, [usn]);

  return (
    <div className="h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col">
        <Sidebar />
        <main className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-black">Course Registered</h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {/* Student Info */}
              <div className="mb-6 p-4 bg-gray-100 rounded shadow text-black">
                <p>
                  <strong>Name:</strong> {studentName || "Unknown"}
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
                          <td className="border border-gray-300 p-2">{formatDate(course.result_year)}</td>
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

export default ViewCourseRegistered;
