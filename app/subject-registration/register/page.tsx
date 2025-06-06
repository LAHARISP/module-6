
"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";

const CourseRegistration: React.FC = () => {
  const [admYear, setAdmYear] = useState<string>(""); // Admission Year
  const [semester, setSemester] = useState<string>(""); // Semester selection
  const [resultYear, setResultYear] = useState<string>(""); // Result Year selection
  const [students, setStudents] = useState<any[]>([]); // List of students
  const [subjects, setSubjects] = useState<any[]>([]); // List of subjects
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]); // Selected students
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]); // Selected subjects
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const course = "CS"; // Constant course for student details
  const branch = "CS"; // Constant branch for subject details

  // Fetch Students Based on Admission Year
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!admYear) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/getStudentDetails?course=${course}&adm_year=${admYear}`);
        if (!response.ok) {
          throw new Error("Failed to fetch students.");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [admYear]);

  // Fetch Subjects Based on Semester, Result Year, and Branch
  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (!semester || !resultYear) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/subjectlist-coursereg?branch=${branch}&semester=${semester}&result_year=${resultYear}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subjects.");
        }
        const data = await response.json();
        setSubjects(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch subject data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [semester, resultYear]);

  // Handle Student Checkbox Selection
  const handleStudentSelection = (usn: string) => {
    setSelectedStudents((prev) =>
      prev.includes(usn) ? prev.filter((id) => id !== usn) : [...prev, usn]
    );
  };

  // Handle Subject Checkbox Selection
  const handleSubjectSelection = (subCode: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subCode) ? prev.filter((code) => code !== subCode) : [...prev, subCode]
    );
  };

  // Register Data into the Database
  const handleRegister = async () => {
    if (selectedStudents.length === 0 || selectedSubjects.length === 0) {
      alert("Please select both students and subjects before registering.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        students: selectedStudents.map((usn) =>
          students.find((student) => student.usno === usn)
        ), // Include full student details
        subjects: selectedSubjects.map((subCode) =>
          subjects.find((subject) => subject.sub_code === subCode)
        ), // Include full subject details
        semester,
        resultYear,
        course,
        branch,
      };

      console.log(payload.students, payload.subjects);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to register data.");
      }

      alert("Registration successful!");
      setSelectedStudents([]);
      setSelectedSubjects([]);
    } catch (err: any) {
      console.error("Registration failed:", err.message);
      alert(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Course Registration</h2>

          {/* Dropdowns for Admission Year, Semester, and Result Year */}
          <div className="flex justify-center gap-6 mb-6">
            <div>
              <label className="block text-black font-medium mb-2">Admission Year</label>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                value={admYear}
                onChange={(e) => setAdmYear(e.target.value)}
              >
                <option value="" disabled>
                  Select Admission Year
                </option>
                <option value="2022-08-01">2022-08-01</option>
                <option value="2023-08-01">2023-08-01</option>
                <option value="2024-08-01">2024-08-01</option>
              </select>
            </div>

            <div>
              <label className="block text-black font-medium mb-2">Semester</label>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {[...Array(8)].map((_, index) => (
                  <option key={`semester-${index}`} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black font-medium mb-2">Result Year</label>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                value={resultYear}
                onChange={(e) => setResultYear(e.target.value)}
              >
                <option value="" disabled>
                  Select Result Year
                </option>
                <option value="2024-01-06">2024-01-06</option>
                <option value="2025-01-01">2025-01-01</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Students and Subjects Tables */}
          <div className="flex flex-row justify-between gap-4">
            {/* Students Table */}
            {students.length > 0 && (
              <div className="w-1/2">
                <h3 className="text-xl font-bold mb-4">Students</h3>
                <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">USN</th>
                      <th className="border p-2">Student Name</th>
                      <th className="border p-2">Mentor</th>
                      <th className="border p-2">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.usno}>
                        <td className="border p-2">{student.usno}</td>
                        <td className="border p-2">{student.s_name}</td>
                        <td className="border p-2">{student.mentor}</td>
                        <td className="border p-2">
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
            )}

            {/* Subjects Table */}
            {subjects.length > 0 && (
              <div className="w-1/2">
                <h3 className="text-xl font-bold mb-4">Subjects</h3>
                <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Subject Code</th>
                      <th className="border p-2">Subject Name</th>
                      <th className="border p-2">Credits</th>
                      <th className="border p-2">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.sub_code}>
                        <td className="border p-2">{subject.sub_code}</td>
                        <td className="border p-2">{subject.sub_desc}</td>
                        <td className="border p-2">{subject.crhrs}</td>
                        <td className="border p-2">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.sub_code)}
                            onChange={() => handleSubjectSelection(subject.sub_code)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Register Button */}
          {students.length > 0 && subjects.length > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={handleRegister}
                className="bg-green-500 text-white py-2 px-6 rounded"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
