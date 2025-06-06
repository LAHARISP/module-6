"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";

const ViewFacultyAllocation: React.FC = () => {
  const [semester, setSemester] = useState<string>("");
  const [resultYear, setResultYear] = useState<string>("");
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [section, setSection] = useState<string>("");

  const Branch = "CS";

  // Fetch allocations based on semester and result year
  const fetchAllocations = async () => {
    if (!semester || !resultYear) {
      alert("Please select both Semester and Result Year.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/view-faculty-allocation?semester=${semester}&result_year=${resultYear}&Branch=${Branch}`
      );

      if (!response.ok) throw new Error("Failed to fetch allocations.");

      const data = await response.json();

      const mappedAllocations = data.map((alloc: any) => ({
        result_year: alloc.result_year,
        semester: alloc.semester,
        brcode: alloc.brcode || alloc.branch,
        sub_code: alloc.sub_code,
        sect: alloc.sect,
        facultyname: alloc.facultyname,
        sub_desc: alloc.sub_desc,
      }));

      setAllocations(mappedAllocations || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch faculty list
  const fetchFacultyList = async () => {
    try {
      const response = await fetch(`/api/facultylist?department=CS`);
      if (!response.ok) throw new Error("Failed to fetch faculty list.");
      const data = await response.json();
      setFacultyList(data || []);
    } catch (err: any) {
      alert(err.message || "Failed to fetch faculty list.");
    }
  };

  // Handle Modify button click
  const handleModify = (allocation: any) => {
    setModifyMode(true);
    setSelectedRow(allocation);
    setSemester(allocation.semester || "");
    setResultYear(allocation.result_year.split("T")[0]);
    setSection(allocation.sect || "");
    fetchFacultyList();
    setSelectedFaculty(null);
  };

  // Handle allocation update
  const handleUpdate = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty.");
      return;
    }
  
    const payload = {
      subjectCode: selectedRow?.sub_code,
      section,
      semester: parseInt(semester), // Ensure semester is sent as a number
      resultYear: new Date(resultYear).toISOString().split("T")[0], // Format resultYear as ISO string (YYYY-MM-DD)
      facultyId: selectedFaculty,
      facultyName: facultyList.find((f) => f.employee_id === selectedFaculty)?.faculty_name || "",
    };
  
    try {
      setLoading(true);
      const response = await fetch("/api/update-faculty-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update allocation.");
      }
  
      alert("Allocation updated successfully!");
      fetchAllocations();
      setModifyMode(false);
      setSelectedRow(null);
    } catch (err: any) {
      alert(err.message || "Error updating allocation.");
    } finally {
      setLoading(false);
    }
  };
  

  // Handle delete button click
  const handleDelete = async (allocation: any) => {
    const { result_year, semester, brcode, sub_code, sect } = allocation;

    if (!result_year || !semester || !brcode || !sub_code || !sect) {
      alert("Missing required allocation details.");
      return;
    }

    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        resultYear: result_year,
        semester: semester.toString(),
        branchCode: brcode,
        subjectCode: sub_code,
        section: sect,
      });

      const response = await fetch(`/api/delete-faculty-allocation?${queryParams}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete allocation.");
      }

      alert("Allocation deleted successfully!");
      setAllocations((prev) =>
        prev.filter(
          (alloc) =>
            alloc.result_year !== result_year ||
            alloc.semester !== semester ||
            alloc.brcode !== brcode ||
            alloc.sub_code !== sub_code ||
            alloc.sect !== sect
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to delete allocation.");
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
          <h2 className="text-2xl font-bold text-center mb-6">
            View Faculty and Subject Allocations
          </h2>

          {!modifyMode && (
            <>
              <div className="flex justify-center gap-6 mb-6">
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
                      <option key={index} value={index + 1}>
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
                    <option value="2025-01-06">2025-01-06</option>
                  </select>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={fetchAllocations}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? "Fetching..." : "Fetch Allocations"}
                </button>
              </div>

              {error && <p className="text-red-500 text-center mt-4">{error}</p>}

              {allocations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4">Allocations</h3>
                  <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Subject Name</th>
                        <th className="border p-2">Subject Code</th>
                        <th className="border p-2">Section</th>
                        <th className="border p-2">Faculty Name</th>
                        <th className="border p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((alloc) => (
                        <tr key={`${alloc.sub_code}-${alloc.sect}`}>
                          <td className="border p-2">{alloc.sub_desc}</td>
                          <td className="border p-2">{alloc.sub_code}</td>
                          <td className="border p-2">{alloc.sect}</td>
                          <td className="border p-2">{alloc.facultyname}</td>
                          <td className="border p-2">
                            <button
                              onClick={() => handleModify(alloc)}
                              className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                            >
                              Modify
                            </button>
                            <button
                              onClick={() => handleDelete(alloc)}
                              className="bg-red-500 text-white py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {modifyMode && selectedRow && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Modify Allocation</h3>
              <div className="border border-gray-400 p-4 rounded bg-gray-100 mb-4">
                <h4 className="font-medium mb-2">Selected Allocation Details</h4>
                <p>
                  <strong>Subject Name:</strong> {selectedRow.sub_desc}
                </p>
                <p>
                  <strong>Subject Code:</strong> {selectedRow.sub_code}
                </p>
                <p>
                  <strong>Semester:</strong> {semester}
                </p>
                <p>
                  <strong>Result Year:</strong> {resultYear}
                </p>
              </div>

              <div className="flex gap-6 mb-4">
                <div>
                  <label className="block text-black font-medium mb-2">Section</label>
                  <select
                    className="border border-gray-400 p-3 rounded bg-white text-black"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  >
                    <option value="A">A</option>       
                    <option value="B">B</option>       
                    <option value="C">C</option>       
                    <option value="D">D</option>       
                    <option value="E">E</option>       
                    <option value="F">F</option>       
                    <option value="G">G</option>
                    <option value="H">H</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Faculty List</h4>
                <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Faculty ID</th>
                      <th className="border p-2">Faculty Name</th>
                      <th className="border p-2">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyList.map((faculty) => (
                      <tr key={faculty.employee_id}>
                        <td className="border p-2">{faculty.employee_id}</td>
                        <td className="border p-2">{faculty.faculty_name}</td>
                        <td className="border p-2">
                          <input
                            type="checkbox"
                            onChange={() => setSelectedFaculty(faculty.employee_id)}
                            checked={selectedFaculty === faculty.employee_id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setModifyMode(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFacultyAllocation;
