"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";

const COURSE = "CS";
const DEPARTMENT = "CS";

const Home: React.FC = () => {
  const [admissionYear, setAdmissionYear] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null); // Only one faculty can be selected
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStudentDetails = async (year: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getStudentDetails?course=${COURSE}&adm_year=${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch students.");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching student details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/facultylist?department=${DEPARTMENT}`);
      if (!response.ok) throw new Error("Failed to fetch faculties.");
      const data = await response.json();
      setFaculties(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching faculty details.");
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year: string) => {
    setAdmissionYear(year);
    setError(null);
    fetchStudentDetails(year);
    fetchFacultyDetails();
  };

  const handleStudentSelection = (usn: string) => {
    setSelectedStudents((prev) =>
      prev.includes(usn) ? prev.filter((id) => id !== usn) : [...prev, usn]
    );
  };

  const handleFacultySelection = (name: string) => {
    setSelectedFaculty(name); // Set the selected faculty name (ensures only one is selected)
  };

  const handleAllocate = async () => {
    if (selectedStudents.length === 0 || !selectedFaculty) {
      alert("Please select students and a faculty before allocating.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/mentorallocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: selectedStudents,
          faculty: selectedFaculty, // Send the single selected faculty
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Allocation successful!");
        setSelectedStudents([]);
        setSelectedFaculty(null); // Clear the selection
      } else {
        alert(`Allocation failed: ${result.error || "Unknown error"}`);
        console.error("Error response from API:", result);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred during allocation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Allocate Mentors</h2>

          {error && <p className="text-red-600">{error}</p>}
          {loading && <p className="text-blue-600">Loading...</p>}

          <div className="mb-8 text-center">
            <select
              className="border border-gray-400 p-3 rounded bg-white text-black"
              value={admissionYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="" disabled>
                Select Admission Year
              </option>
              <option value="2023-08-01">2023-08-01</option>
              <option value="2022-08-01">2022-08-01</option>
            </select>
          </div>

          {admissionYear && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-center">Students</h3>
                <table className="border-collapse border border-gray-400 w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">USN</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Mentor Assigned</th>
                      <th className="border p-2 text-center">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.usno} className="bg-white">
                        <td className="border p-2">{student.usno}</td>
                        <td className="border p-2">{student.s_name}</td>
                        <td className="border p-2">{student.mentor || "Not Assigned"}</td>
                        <td className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.usno)}
                            onChange={() => handleStudentSelection(student.usno)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
  <h3 className="text-lg font-bold mb-4 text-center">Faculties</h3>
  <table className="border-collapse border border-gray-400 w-full bg-white">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2 text-left">Name</th>
        <th className="border p-2 text-center">Select</th>
      </tr>
    </thead>
    <tbody>
      {faculties.map((faculty) => (
        <tr key={faculty.fname} className="bg-white">
          <td className="border p-2">{faculty.faculty_name}</td>
          <td className="border p-2 text-center">
            <input
              type="checkbox"
              checked={selectedFaculty === faculty.faculty_name} // Only one checkbox can be checked
              onChange={() => setSelectedFaculty(faculty.faculty_name)} // Set the selected faculty
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

            </div>
          )}

          {admissionYear && (
            <div className="mt-8 text-center">
              <button
                onClick={handleAllocate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Allocate
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
