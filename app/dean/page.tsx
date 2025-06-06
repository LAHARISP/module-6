"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import ResultYearDropdown from "@/components/resultYear";

const Home: React.FC = () => {
  const [branch, setBranch] = useState<string>(""); // Selected branch
  const [semester, setSemester] = useState<string>(""); // Selected semester
  const [resultYear, setResultYear] = useState<string>(""); // Selected result year
  const [branches, setBranches] = useState<string[]>([]); // List of branches
  const [subjects, setSubjects] = useState<any[]>([]); // Subjects data
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]); // Selected subjects
  const [error, setError] = useState<string | null>(null);

  // Fetch branch list from the uploaded file or API
  const fetchBranches = async () => {
    try {
      // Mocking the branch list based on the uploaded file data
      const branchList = [
        "AE",
        "AI",
        "CB",
        "CS",
        "CV",
        "EC",
        "EE",
        "EI",
        "ET",
        "IM",
        "IS",
        "ME",
        "MCA",
        "MTECH",
        "MBA"

      ];
      setBranches(branchList);
    } catch (err) {
      console.error("Error fetching branch list:", err);
      setError("Failed to fetch branch list.");
    }
  };

  // Fetch subjects based on branch, semester, and result year
  const fetchSubjects = async () => {
    if (!branch || !semester || !resultYear) {
      alert("Please select Branch, Semester, and Result Year.");
      return;
    }

    try {
      const response = await fetch(
        `/api/subjectlistmastertable?branch=${branch}&semester=${semester}&result_year=${encodeURIComponent(
          resultYear
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch subjects.");
      }

      const data = await response.json();
      setSubjects(data);
      setError(null); // Clear error state
    } catch (err) {
      console.error("Error fetching subjects:", err.message);
      setError(err.message || "Failed to fetch subjects.");
    }
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = (subCode: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subCode)
        ? prev.filter((code) => code !== subCode)
        : [...prev, subCode]
    );
  };

  // Approve selected subjects
  const approveSubjects = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject to approve.");
      return;
    }

    try {
      const response = await fetch("/api/approve-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch, semester, resultYear, subjects: selectedSubjects }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve subjects.");
      }

      alert("Selected subjects approved successfully!");
      setSelectedSubjects([]); // Clear selected subjects
      fetchSubjects(); // Refresh the subjects list
    } catch (err) {
      console.error("Error approving subjects:", err.message);
      alert("Failed to approve subjects. Please try again.");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />

        <main className="w-full max-w-5xl p-8 bg-white mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Subject Approvals</h2>

          {/* Dropdowns for Branch, Semester, and Result Year */}
          <div className="flex items-center gap-6 justify-center">
            {/* Branch Dropdown */}
            <div className="flex-grow">
              <label className="block text-black font-medium mb-2">Branch</label>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches.map((br, index) => (
                  <option key={index} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>

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
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

             {/* Integrate ResultYearDropdown Component */}
             <ResultYearDropdown value={resultYear} onChange={setResultYear} />

            {/* Fetch Subjects Button */}
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
                    
                    <th className="border p-2">Credits</th>
                    <th className="border p-2">Approved</th>
                    <th className="border p-2">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={`${subject.sub_code}-${index}`}>
                      
                      <td className="border p-2">{subject.sub_code}</td>
                      <td className="border p-2">{subject.sub_desc}</td>
                      
                      <td className="border p-2">{subject.crhrs}</td>
                      <td className="border p-2">{subject.dean_approval}</td>
                      <td className="border p-2">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject.sub_code)}
                          onChange={() => handleCheckboxToggle(subject.sub_code)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">
                {branch && semester && resultYear
                  ? "No subjects found."
                  : "Please select Branch, Semester, and Result Year to fetch subjects."}
              </p>
            )}
          </div>

          {/* Approve Button */}
          {subjects.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={approveSubjects}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Approve Selected Subjects
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
