
"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

const BRANCH = "CS"; // Set constant branch

const SubjectAllocation: React.FC = () => {
  const [semester, setSemester] = useState<string>("");
  const [prevResultYear, setPrevResultYear] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null); // Selected subject for modification
  const [newSubject, setNewSubject] = useState<any | null>(null); // New subject for adding
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSubjects = async () => {
    if (!semester || !prevResultYear) {
      alert("Please select Semester and Previous Result Year.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/subjectlist?branch=${BRANCH}&semester=${semester}&result_year=${encodeURIComponent(
          prevResultYear
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch subjects.");
      }

      const data = await response.json();
      setSubjects(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching subject details:", err.message);
      setError(err.message || "Failed to fetch subjects.");
    } finally {
      setLoading(false);
    }
  };

  const handleModify = (subject: any) => {
    setSelectedSubject({ ...subject });
  };

  const handleInputChange = (field: string, value: string | number, isNew: boolean = false) => {
    if (isNew) {
      setNewSubject({
        ...newSubject,
        [field]: value,
      });
    } else if (selectedSubject) {
      setSelectedSubject({
        ...selectedSubject,
        [field]: value,
      });
    }
  };

  const saveModifiedSubject = async () => {
    if (!selectedSubject) {
      alert("No subject selected.");
      return;
    }

    try {
      setLoading(true);
      const updatedSubject = { ...selectedSubject };

      const response = await fetch("/api/addsubjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects: [updatedSubject] }),
      });

      if (response.ok) {
        alert("Subject successfully updated and added to the new result year!");
        setSelectedSubject(null); // Clear the form
        fetchSubjects(); // Refresh the subjects list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subject.");
      }
    } catch (err) {
      console.error("Error updating subject:", err.message);
      alert(`Failed to update subject. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addNewSubject = async () => {
    if (!newSubject) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/addsubjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects: [newSubject] }),
      });

      if (response.ok) {
        alert("New subject successfully added!");
        setNewSubject(null); // Clear the form
        fetchSubjects(); // Refresh the table
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add new subject.");
      }
    } catch (err) {
      console.error("Error adding new subject:", err.message);
      alert(`Failed to add new subject. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />

        <div className="flex-1 flex flex-col items-center justify-start p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Subject Allocation</h2>

          {!selectedSubject && !newSubject ? (
            <>
              <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
                {/* Dropdowns */}
                <div className="flex gap-6 w-full">
                  <div className="flex flex-col w-1/2">
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

                  <div className="flex flex-col w-1/2">
                    <label className="block text-black font-medium mb-2">Previous Result Year</label>
                    <select
                      className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                      value={prevResultYear}
                      onChange={(e) => setPrevResultYear(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Previous Result Year
                      </option>
                      <option value="2024-01-06">2024-01-06</option>
                      <option value="2025-01-06">2025-01-06</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={fetchSubjects}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Get Subjects"}
                  </button>
                  <button
                    onClick={() =>
                      setNewSubject({
                        result_year: "",
                        sub_code: "",
                        sub_desc: "",
                        scheme: "",
                        subject_type: "",
                        branch: BRANCH,
                        semester: 0,
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

              {/* Error Message */}
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}

              {/* Subjects Table */}
              <div className="mt-8 w-full max-w-4xl">
                {subjects.length > 0 ? (
                  <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Sub Code</th>
                        <th className="border p-2">Subject Name</th>
                        <th className="border p-2">Scheme</th>
                        <th className="border p-2">Subject Type</th>
                        <th className="border p-2">Branch</th>
                        <th className="border p-2">Semester</th>
                        <th className="border p-2">Credits</th>
                        <th className="border p-2">Suborder</th>
                        <th className="border p-2">Modify</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.sub_code}>
                          <td className="border p-2">{subject.sub_code}</td>
                          <td className="border p-2">{subject.sub_desc}</td>
                          <td className="border p-2">{subject.scheme}</td>
                          <td className="border p-2">{subject.subject_type}</td>
                          <td className="border p-2">{subject.branch}</td>
                          <td className="border p-2">{subject.semester}</td>
                          <td className="border p-2">{subject.crhrs}</td>
                          <td className="border p-2">{subject.suborder}</td>
                          <td className="border p-2">
                            <button
                              onClick={() => handleModify(subject)}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                              Modify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500">
                    {semester && prevResultYear
                      ? "No subjects available."
                      : "Please select Semester and Previous Result Year to fetch subjects."}
                  </p>
                )}
              </div>
            </>
          ) : selectedSubject ? (
            <div className="mt-8 w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-4 text-center">Edit Subject</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-medium mb-2">Result Year</label>
                  <select
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={selectedSubject.result_year || ""}
                    onChange={(e) => handleInputChange("result_year", e.target.value)}
                  >
                    <option value="" disabled>
                      Select Result Year
                    </option>
                    <option value="2024-01-06">2024-01-06</option>
                    <option value="2025-01-06">2025-01-06</option>
                  </select>
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Sub Code</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={selectedSubject.sub_code || ""}
                    onChange={(e) => handleInputChange("sub_code", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Subject Name</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={selectedSubject.sub_desc || ""}
                    onChange={(e) => handleInputChange("sub_desc", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Scheme</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={selectedSubject.scheme || ""}
                    onChange={(e) => handleInputChange("scheme", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Credits</label>
                  <input
                    type="number"
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={selectedSubject.crhrs || ""}
                    onChange={(e) => handleInputChange("crhrs", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={saveModifiedSubject}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add to New Result Year"}
                </button>
              </div>
            </div>
          ) : newSubject ? (
            <div className="mt-8 w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-4 text-center">Add New Subject</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-medium mb-2">Result Year</label>
                  <select
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.result_year || ""}
                    onChange={(e) => handleInputChange("result_year", e.target.value, true)}
                  >
                    <option value="" disabled>
                      Select Result Year
                    </option>
                    <option value="2024-01-06">2024-01-06</option>
                    <option value="2025-01-06">2025-01-06</option>
                  </select>
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Sub Code</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.sub_code || ""}
                    onChange={(e) => handleInputChange("sub_code", e.target.value, true)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Subject Name</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.sub_desc || ""}
                    onChange={(e) => handleInputChange("sub_desc", e.target.value, true)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Scheme</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.scheme || ""}
                    onChange={(e) => handleInputChange("scheme", e.target.value, true)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Subject Type</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.subject_type || ""}
                    onChange={(e) => handleInputChange("subject_type", e.target.value, true)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Branch</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.branch|| BRANCH}
                    onChange={(e) => handleInputChange("BRANCH", e.target.value, true)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Semester</label>
                  <input
                    type="number"
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.semester || ""}
                    onChange={(e) =>
                      handleInputChange("semester", parseInt(e.target.value) || 0, true)
                    }
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Credits</label>
                  <input
                    type="number"
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.crhrs || ""}
                    onChange={(e) => handleInputChange("crhrs", parseInt(e.target.value) || 0, true)}
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Suborder</label>
                  <input
                    type="number"
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={newSubject.suborder || ""}
                    onChange={(e) =>
                      handleInputChange("suborder", parseInt(e.target.value) || 0, true)
                    }
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubjectAllocation;
