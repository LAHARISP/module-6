
"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";
import ResultYearDropdown from "@/components/resultYear";

const BRANCH = "CS"; // Constant for branch

const Home: React.FC = () => {
  const [semester, setSemester] = useState<string>("");
  const [resultYear, setResultYear] = useState<string>(""); // Dropdown selected year
  const [subjects, setSubjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
 

  const formatDateToYYYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if invalid date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  

  const fetchSubjects = async () => {
    if (!semester || !resultYear) {
      alert("Please select Semester and Result Year.");
      return;
    }

    try {
      const response = await fetch(
        `/api/subjectlistmastertable?branch=${BRANCH}&semester=${semester}&result_year=${encodeURIComponent(resultYear)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch subjects.");
      }

      const data = await response.json();
      setSubjects(data);
      setError(null); // Clear error state
    } catch (err) {
      console.error("Error fetching subject details:", err);
      setError((err as Error).message || "Failed to fetch subjects.");
    }
  };

  const updateSubject = async (updatedSubject: any) => {
    try {
      const response = await fetch(`/api/update-subject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSubject),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subject.");
      }

      alert("Subject successfully updated!");
      fetchSubjects(); // Refresh subject list
      setEditingSubject(null); // Reset editingSubject after update
    } catch (err) {
      console.error("Error updating subject:", err);
      alert(`Failed to update subject. ${(err as Error).message}`);
    }
  };

  const deleteSubject = async (subjectCode: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
      const response = await fetch(`/api/delete-subject`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub_code: subjectCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          alert("Failed to delete subject as dean has approved the subject.");
        } else {
          alert(result.error || "Failed to delete subject.");
        }
        return;
      }

      alert("Subject successfully deleted!");
      fetchSubjects(); // Refresh the subject list
    } catch (err: any) {
      console.error("Error deleting subject:", err.message);
      alert(`Failed to delete subject. ${err.message}`);
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />

        <main className="w-full max-w-5xl p-8 bg-white mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">View Master Subject Table</h2>

          {!editingSubject && (
            <>
              <div className="flex items-center gap-6 justify-center">
                <div>
                  <label className="block text-black font-medium mb-2">Semester</label>
                  <select
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={semester || ""}
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

                 {/* Integrate ResultYearDropdown Component */}
                <ResultYearDropdown value={resultYear} onChange={setResultYear} />


                

                <div>
                  <button
                    onClick={fetchSubjects}
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                  >
                    Fetch Subjects
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-center mt-4">{error}</p>}

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
                        <th className="border p-2">Dean Approval</th>
                        <th className="border p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, index) => (
                        <tr key={`${subject.sub_code}-${index}`}>
                          <td className="border p-2">{subject.sub_code}</td>
                          <td className="border p-2">{subject.sub_desc}</td>
                          <td className="border p-2">{subject.subject_type}</td>
                          <td className="border p-2">{subject.scheme}</td>
                          <td className="border p-2">{subject.crhrs}</td>
                          <td className="border p-2">{subject.dean_approval}</td>
                          <td className="border p-2">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() =>
                                  setEditingSubject({
                                    ...subject,
                                    result_year: resultYear, // Update form with dropdown value
                                  })
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Modify
                              </button>
                              <button
                                onClick={() => deleteSubject(subject.sub_code)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
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
            </>
          )}

          {editingSubject && (
            <div className="mt-8 p-6 border rounded bg-gray-100">
              <h3 className="text-lg font-bold mb-4">Modify Subject</h3>
              <div className="grid grid-cols-2 gap-4">
              <div>
              <label className="block font-medium mb-2 text-black">Result Year</label>
              <input
                type="date"
                className="border border-gray-400 p-3 rounded bg-gray-300 text-black w-full"
                value={
                  editingSubject?.result_year
                    
                }
                disabled
              />
            </div>


                
                <div>
                  <label className="block font-medium mb-2 text-black">Semester</label>
                  <select
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={editingSubject?.semester || ""}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, semester: e.target.value })
                    }
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

                <div>
                  <label className="block font-medium mb-2 text-black">Subject Name</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={editingSubject?.sub_desc || ""}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, sub_desc: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-black">Subject Code</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-gray-300 text-black w-full"
                    value={editingSubject?.sub_code || ""}
                    disabled
                  />
                </div>


                <div>
                  <label className="block font-medium mb-2 text-black">Subject Type</label>
                  <select
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={editingSubject?.subject_type || ""}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, subject_type: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Subject Type
                    </option>
                    <option value="IDE">IDE</option>
                    <option value="Department Elective">Department Elective</option>
                    <option value="Internship">Internship</option>
                    <option value="Project">Project</option>
                    <option value="Mini Project">Mini Project</option>
                    <option value="Lab">Lab</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Regular Subject">Regular Subject</option>
                    <option value="No Credit Subject">No Credit Subject</option>
                    <option value="SCR">SCR</option>
                  </select>
                </div>

                

                <div>
                  <label className="block font-medium mb-2 text-black">Scheme</label>
                  <input
                    className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                    value={editingSubject?.scheme || ""}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, scheme: e.target.value })
                    }
                  />
                </div>


                
                              <div>
                <label className="block font-medium mb-2 text-black">Credits</label>
                <select
                  className="border border-gray-400 p-3 rounded bg-white text-black w-full"
                  value={editingSubject?.crhrs || ""}
                  onChange={(e) => setEditingSubject({ ...editingSubject, crhrs: e.target.value })}
                >
                  <option value="" disabled>Select Credits</option>
                  {[...Array(26)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>


              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => updateSubject(editingSubject)}
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingSubject(null)}
                  className="ml-4 bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
               
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
