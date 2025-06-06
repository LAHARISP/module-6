"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COURSE = "CS";

const Home: React.FC = () => {
  const [admissionYear, setAdmissionYear] = useState<string>(""); // Default to an empty string
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchStudents = async (year: string) => {
    try {
      const response = await fetch(
        `/api/getStudentDetails?course=${COURSE}&adm_year=${year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data.");
    }
  };

  const handleYearChange = (year: string) => {
    setAdmissionYear(year);
    fetchStudents(year);
  };

  const handleUpdateClick = (studentId: string) => {
    router.push(`/student-mentor-allocation/assign?studentId=${studentId}`);
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Allocate Mentors</h2>

          {error && <p className="text-red-600">{error}</p>}

          {/* Admission Year Dropdown */}
          <div className="mb-8 text-center">
            <select
              className="border border-gray-400 p-3 rounded bg-white text-black"
              value={admissionYear} // Controlled component
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="" disabled>
                Select Admission Year
              </option>
              <option value="2023-08-01">2023-08-01</option>
              <option value="2022-08-01">2022-08-01</option>
            </select>
          </div>

          {/* Students Table */}
          {admissionYear ? (
            <div>
              <h3 className="text-lg font-bold mb-4 text-center text-black">
                Students and Mentor Allocation
              </h3>
              {error && <p className="text-red-600 text-center">{error}</p>}
              {students.length > 0 ? (
                <table className="border-collapse border border-gray-400 w-full text-center bg-white">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 p-2 text-black">USN</th>
                      <th className="border border-gray-400 p-2 text-black">Name</th>
                      <th className="border border-gray-400 p-2 text-black">Mentor</th>
                      <th className="border border-gray-400 p-2 text-black">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.usno}>
                        <td className="border border-gray-400 p-2 text-black">
                          {student.usno}
                        </td>
                        <td className="border border-gray-400 p-2 text-black">
                          {student.s_name}
                        </td>
                        <td className="border border-gray-400 p-2 text-black">
                          {student.mentor || "Not Assigned"}
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => handleUpdateClick(student.usno)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-black text-center">
                  No students found for the selected academic year.
                </p>
              )}
            </div>
          ) : (
            <p className="text-black text-center">
              Please select an academic year to view details.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
