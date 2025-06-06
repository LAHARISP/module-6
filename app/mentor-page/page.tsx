
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const StudentDetails: React.FC = () => {
  const [students, setStudents] = useState([]);
  const [admYear, setAdmYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const mentor = "Vinodkumar KP";
  const router = useRouter();

  const fetchStudents = async () => {
    if (!admYear) {
      alert("Please select an admission year.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/menteelist?adm_year=${admYear}&mentor=${mentor}`
      );
      if (!response.ok) throw new Error("Failed to fetch student details.");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching student details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdmYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdmYear(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleNavigation = (path: string, student: any) => {
    const query = new URLSearchParams({
      usno: student.usno,
      s_name: student.s_name,
      mentor: student.mentor,
      course: student.course || "",
    }).toString();

    router.push(`${path}?${query}`);
  };

  const toggleExpanded = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.s_name.toLowerCase().includes(searchTerm) ||
      student.usno.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Student Details</h2>

          {/* Admission Year Selector */}
          <div className="mb-6">
            <label htmlFor="admYear" className="block text-lg font-medium mb-2">
              Select Admission Year:
            </label>
            <select
              id="admYear"
              value={admYear}
              onChange={handleAdmYearChange}
              className="border p-2 w-full"
            >
              <option value="">Select Admission Year</option>
              <option value="2022-08-01">2022-08-01</option>
              <option value="2023-08-01">2023-08-01</option>
            </select>
          </div>

          {/* Fetch Students Button */}
          <button
            onClick={fetchStudents}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Students
          </button>

          {/* Search Bar */}
          {students.length > 0 && (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Search by Name or USN"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border p-2 w-full"
              />
            </div>
          )}

          {/* Student Table */}
          {loading ? (
            <p className="mt-4 text-center">Loading...</p>
          ) : error ? (
            <p className="mt-4 text-red-600 text-center">{error}</p>
          ) : filteredStudents.length > 0 ? (
            <table className="mt-6 border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">USN</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Mentor</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{student.usno}</td>
                    <td className="border border-gray-300 p-2">{student.s_name}</td>
                    <td className="border border-gray-300 p-2">{student.mentor}</td>
                    <td className="border border-gray-300 p-2">
                      {/* Expandable Actions */}
                      <div>
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded w-full text-left"
                        >
                          Actions
                        </button>
                        {expanded === index && (
                          <div className="mt-2 bg-white border border-gray-300 rounded shadow-md p-4">
                            {/* Technical Event */}
                            <div className="mb-2">
                              <h4 className="font-medium mb-1">Technical Event</h4>
                              <button
                                onClick={() =>
                                  handleNavigation(
                                    "/student-technicalevents/insert",
                                    student
                                  )
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                              >
                                Insert
                              </button>
                              <button
                                onClick={() =>
                                  handleNavigation(
                                    "/student-technicalevents/view",
                                    student
                                  )
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                View
                              </button>
                            </div>

                            {/* Counselling */}
                            <div className="mb-2">
                              <h4 className="font-medium mb-1">Counselling</h4>
                              <button
                                onClick={() =>
                                  handleNavigation("/student-councelling/insert", student)
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                              >
                                Insert
                              </button>
                              <button
                                onClick={() =>
                                  handleNavigation("/student-councelling/view", student)
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                View
                              </button>
                            </div>

                            {/* Extracurricular */}
                            <div className="mb-2">
                              <h4 className="font-medium mb-1">Extracurricular</h4>
                              <button
                                onClick={() =>
                                  handleNavigation(
                                    "/student-extracurricular/insert",
                                    student
                                  )
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                              >
                                Insert
                              </button>
                              <button
                                onClick={() =>
                                  handleNavigation(
                                    "/student-extracurricular/view",
                                    student
                                  )
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                View
                              </button>
                            </div>

                            {/* Course Registered */}
                            <div className="mb-2">
                              <h4 className="font-medium mb-1">Course Registered</h4>
                              <button
                                onClick={() =>
                                  handleNavigation("/view-course-reg", student)
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                View
                              </button>
                            </div>

                            {/* Student Details */}
                            <div className="mb-2">
                              <h4 className="font-medium mb-1">Student Details</h4>
                              <button
                                onClick={() =>
                                  handleNavigation("/student-details", student)
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-6 text-center text-gray-500">
              No student details available.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDetails;
