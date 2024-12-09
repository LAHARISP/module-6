"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ViewFacultyAllocation: React.FC = () => {
  const [semester, setSemester] = useState<string>(""); // Semester selection
  const [resultYear, setResultYear] = useState<string>(""); // Result year selection
  const [allocations, setAllocations] = useState<any[]>([]); // List of allocations
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const brcode = "CS"; // Set the constant branch code in the frontend

  const router = useRouter();

  // Fetch Allocations Based on Semester and Result Year
  const fetchAllocations = async () => {
    if (!semester || !resultYear) {
      alert("Please select both Semester and Result Year.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send the brcode, semester, and result_year to the API
      const response = await fetch(
        `/api/view-faculty-allocation?semester=${semester}&result_year=${resultYear}&brcode=${brcode}`
      );
      if (!response.ok) throw new Error("Failed to fetch allocations.");
      const data = await response.json();
      setAllocations(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Deletion of Allocation
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this allocation?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/delete-faculty-allocation?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete allocation.");
      alert("Allocation deleted successfully!");
      setAllocations((prev) => prev.filter((alloc) => alloc.pky !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete allocation.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Modify Page
  const handleModify = (allocation: any) => {
    const queryParams = new URLSearchParams({
      resultYear,
      semester,
      subCode: allocation.sub_code,
      section: allocation.sect,
      facultyName: allocation.facultyname,
      facultyId: allocation.employeeid,
    }).toString();

    router.push(`/faculty-allocation/assign?${queryParams}`);
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
                    <tr key={alloc.pky}>
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
                          onClick={() => handleDelete(alloc.pky)}
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
        </div>
      </div>
    </div>
  );
};

export default ViewFacultyAllocation;
