"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const brcode = "CS";

const StudentResults: React.FC = () => {
  const [resultYear, setResultYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (resultYear && semester) {
      fetchResults(resultYear, semester);
    }
  }, [resultYear, semester]);

  const fetchResults = async (year: string, semester: string) => {
    try {
      const response = await fetch(
        `/api/registered-subjects?brcode=${brcode}&result_year=${year}&semester=${semester}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to fetch results.");
      }
      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error("Error fetching results:", error.message);
      setError(error.message);
    }
  };

  const handleUpdateClick = (subCode: string) => {
    router.push(`/subject-registration/register?subCode=${subCode}`);
  };

  const handleDeleteClick = async (subCode: string) => {
    try {
      const response = await fetch(`/api/registered-subjects`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brcode, subcode: subCode }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to delete entry.");
      }
      // Re-fetch results after deletion
      fetchResults(resultYear, semester);
    } catch (error: any) {
      console.error("Error deleting entry:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Subject Registered</h2>

          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Filters */}
          <div className="flex justify-center space-x-4 mb-8">
            <select
              className="border border-gray-400 p-3 rounded bg-white text-black"
              value={resultYear}
              onChange={(e) => setResultYear(e.target.value)}
            >
              <option value="" disabled>Select Result Year</option>
              <option value="2024-01-06">2024-01-06</option>
            </select>

            <select
              className="border border-gray-400 p-3 rounded bg-white text-black"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="" disabled>Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* Results Table */}
          {results.length > 0 ? (
            <table className="border-collapse border border-gray-400 w-full text-center bg-white">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2">USN</th>
                  <th className="border border-gray-400 p-2">Name</th>
                  <th className="border border-gray-400 p-2">Subject Code</th>
                
                  <th className="border border-gray-400 p-2">Credits</th>
                  <th className="border border-gray-400 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={`${result.usn}-${result.subcode}-${index}`}>
                    <td className="border border-gray-400 p-2">{result.usn}</td>
                    <td className="border border-gray-400 p-2">{result.s_name}</td>
                    <td className="border border-gray-400 p-2">{result.subcode}</td>
                   
                    <td className="border border-gray-400 p-2">{result.crta}</td>
                    <td className="border border-gray-400 p-2 flex space-x-2 justify-center">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleUpdateClick(result.subcode)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDeleteClick(result.subcode)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-black">No results found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentResults;
