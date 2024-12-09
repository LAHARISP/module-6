"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";

const BRANCH = "CS"; // Constant for branch

const Home: React.FC = () => {
  const [semester, setSemester] = useState<string>("");
  const [resultYear, setResultYear] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    if (!semester || !resultYear) {
      alert("Please select Semester and Result Year.");
      return;
    }

    try {
      const response = await fetch(
        `/api/subjectlist?branch=${BRANCH}&semester=${semester}&result_year=${encodeURIComponent(resultYear)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch subjects.");
      }

      const data = await response.json();
      setSubjects(data);
      setError(null); // Clear error state
    } catch (err) {
      console.error("Error fetching subject details:", err.message);
      setError(err.message || "Failed to fetch subjects.");
    }
  };

  const sendForDeanApproval = async () => {
    if (subjects.length === 0) {
      alert("No subjects available to send for dean approval.");
      return;
    }

    try {
      const response = await fetch("/api/deanapproval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: BRANCH, semester, resultYear, subjects }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send for dean approval.");
      }

      alert("Subjects successfully sent for dean approval!");
    } catch (err) {
      console.error("Error sending subjects for dean approval:", err.message);
      alert(`Failed to send for dean approval. ${err.message}`);
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />

        <main className="w-full max-w-5xl p-8 bg-white mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">View Master Subject Table</h2>

          {/* Dropdowns and Button in Same Level */}
          <div className="flex items-center gap-6 justify-center">
            {/* Semester Dropdown */}
            <div className="flex-grow">
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
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Result Year Dropdown */}
            <div className="flex-grow">
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

            {/* Fetch Button */}
            <div>
              <button
                onClick={fetchSubjects}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                Fetch Subjects
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Subjects Table */}
          <div className="mt-8">
            {subjects.length > 0 ? (
              <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Sub Code</th>
                    <th className="border p-2">Subject Name</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Scheme</th>
                    <th className="border p-2">Credits</th>
                    <th className="border p-2">Sub Order</th>
                    <th className="border p-2">Semester</th>
                    <th className="border p-2">Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={`${subject.sub_code}-${index}`}>
                      <td className="border p-2">{subject.sub_code}</td>
                      <td className="border p-2">{subject.sub_desc}</td>
                      <td className="border p-2">{subject.SUBJECT_TYPE}</td>
                      <td className="border p-2">{subject.scheme}</td>
                      <td className="border p-2">{subject.crhrs}</td>
                      <td className="border p-2">{subject.suborder}</td>
                      <td className="border p-2">{subject.semester}</td>
                      <td className="border p-2">{BRANCH}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">
                {semester && resultYear
                  ? "No subjects available."
                  : "Please select Semester and Result Year to fetch subjects."}
              </p>
            )}
          </div>

          {/* Dean Approval Button */}
          {subjects.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={sendForDeanApproval}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Send for Dean Approval
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
