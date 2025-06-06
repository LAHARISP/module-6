"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

const SubjectAllocation: React.FC = () => {
  const [branch, setBranch] = useState<string>(""); // Selected branch
  const [semester, setSemester] = useState<string>(""); // Selected semester
  const [prevResultYear, setPrevResultYear] = useState<string>(""); // Selected previous result year
  const [newSubject, setNewSubject] = useState<any | null>(null); // Data for new subject
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message

  const branches =  [
    "EI",
    "AE",
    "ME",
    "EEE",
    "EC",
    "CV",
    "CS",
    "AI",
    "CB",
    "ET",
    "IM",
    "IS",
  ]; // Example branch options

  // Add a new subject to the database
  const addNewSubject = async () => {
    if (!branch || !semester || !prevResultYear || !newSubject) {
      alert("Please select Branch, Semester, Result Year, and fill out all fields.");
      return;
    }
  
    const subjectToSubmit = {
      ...newSubject,
      branch,
      semester: parseInt(semester),
      result_year: prevResultYear,
    };
  
    // Log the data being sent to the API
    console.log("Data being sent to the API:", subjectToSubmit);
  
    try {
      setLoading(true);
      const response = await fetch("/api/addcommonsubject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects: [subjectToSubmit] }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add new subject.");
      }
  
      alert("New subject successfully added!");
      setNewSubject(null); // Clear the form
    } catch (err: any) {
      console.error("Error occurred:", err.message);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle input changes for the form
  const handleInputChange = (field: string, value: string | number) => {
    setNewSubject({
      ...newSubject,
      [field]: value,
    });
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-start p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Subject Allocation</h2>

          {/* Dropdowns for branch, semester, and result year */}
          <div className="flex items-center gap-6 mb-6 w-full max-w-4xl">
            <div className="flex flex-col w-1/4">
              <label className="block text-black font-medium mb-2">Branch</label>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-1/4">
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

            <div className="flex flex-col w-1/4">
              <label className="block text-black font-medium mb-2">Previous Result Year</label>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                value={prevResultYear}
                onChange={(e) => setPrevResultYear(e.target.value)}
              >
                <option value="" disabled>
                  Select Result Year
                </option>
                <option value="2024-01-06">2024-01-06</option>
                <option value="2025-01-01">2025-01-01</option>
                <option value="2025-01-06">2025-01-06</option>
              </select>
            </div>

            <div className="flex flex-col justify-end w-1/4">
              <button
                onClick={() =>
                  setNewSubject({
                    sub_code: "",
                    sub_desc: "",
                    scheme: "",
                    subject_type: "",
                    crhrs: 0,
                    suborder: 0,
                  })
                }
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Add New Subject
              </button>
            </div>
          </div>

          {/* New Subject Form */}
          {newSubject && (
            <div className="mt-6 w-full max-w-4xl border border-gray-300 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 text-center">Add New Subject</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-medium mb-2">Sub Code</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.sub_code || ""}
                    onChange={(e) => handleInputChange("sub_code", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Subject Name</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.sub_desc || ""}
                    onChange={(e) => handleInputChange("sub_desc", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Scheme</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.scheme || ""}
                    onChange={(e) => handleInputChange("scheme", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Subject Type</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.subject_type || ""}
                    onChange={(e) => handleInputChange("subject_type", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Credits</label>
                  <input
                    type="number"
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.crhrs || ""}
                    onChange={(e) => handleInputChange("crhrs", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Suborder</label>
                  <input
                    type="number"
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.suborder || ""}
                    onChange={(e) => handleInputChange("suborder", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={addNewSubject}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Subject"}
                </button>
              </div>

              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectAllocation;
