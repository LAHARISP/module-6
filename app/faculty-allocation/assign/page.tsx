"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

const FacultySubjectAllocation: React.FC = () => {
  const [semester, setSemester] = useState<string>("");
  const [resultYear, setResultYear] = useState<string>("");
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [subjectList, setSubjectList] = useState<any[]>([]);
  const [sectionList] = useState<string[]>(["A", "B", "C", "D"]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const department = "CS";

  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/facultylist?department=${department}`);
        if (!response.ok) throw new Error("Failed to fetch faculty list.");
        const facultyData = await response.json();
        setFacultyList(facultyData);
      } catch (err: any) {
        console.error("Error fetching faculty list:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (semester && resultYear) fetchFacultyList();
  }, [semester, resultYear]);

  useEffect(() => {
    const fetchSubjectList = async () => {
      if (!semester || !resultYear) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/subjectlist?semester=${semester}&result_year=${resultYear}`
        );
        if (!response.ok) throw new Error("Failed to fetch subject list.");
        const subjectData = await response.json();
        setSubjectList(subjectData);
      } catch (err: any) {
        console.error("Error fetching subject list:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectList();
  }, [semester, resultYear]);

  const handleAllocate = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty member.");
      return;
    }
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    if (!selectedSection) {
      alert("Please select a section.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        resultYear,
        semester,
        branchCode: department, // Hardcoded department
        subjects: selectedSubjects,
        section: selectedSection,
        facultyId: selectedFaculty,
      };

      console.log("Payload being sent:", payload); // Debugging payload before sending

      const response = await fetch("/api/allocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to allocate.");
      }
      alert("Allocation successful!");
      setSelectedFaculty(null);
      setSelectedSubjects([]);
      setSelectedSection(null);
    } catch (err: any) {
      console.error("Error during allocation:", err);
      alert(err.message || "Failed to allocate.");
    } finally {
      setLoading(false);
    }
  };

  const isAllocateButtonDisabled =
    !selectedFaculty || selectedSubjects.length === 0 || !selectedSection;

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex gap-8">
              <div className="w-64">
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

              <div className="w-64">
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
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {semester && resultYear && (
            <div className="flex flex-row gap-8 items-start">
              {facultyList.length > 0 && (
                <div className="w-1/2">
                  <h3 className="text-xl font-bold mb-4">Faculty List</h3>
                  <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Faculty Name</th>
                        <th className="border p-2">Faculty ID</th>
                        <th className="border p-2">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyList.map((faculty) => (
                        <tr key={faculty.fid}>
                          <td className="border p-2">{faculty.fname}</td>
                          <td className="border p-2">{faculty.fid}</td>
                          <td className="border p-2">
                            <input
                              type="radio"
                              name="faculty"
                              onChange={() => setSelectedFaculty(faculty.fid)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {subjectList.length > 0 && (
                <div className="w-1/2">
                  <h3 className="text-xl font-bold mb-4">Subject List</h3>
                  <table className="border-collapse border border-gray-400 w-full bg-white text-center">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Subject Name</th>
                        <th className="border p-2">Subject Code</th>
                        <th className="border p-2">Credits</th>
                        <th className="border p-2">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectList.map((subject) => (
                        <tr key={subject.sub_code}>
                          <td className="border p-2">{subject.sub_desc}</td>
                          <td className="border p-2">{subject.sub_code}</td>
                          <td className="border p-2">{subject.crhrs}</td>
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                setSelectedSubjects((prev) =>
                                  e.target.checked
                                    ? [...prev, subject.sub_code]
                                    : prev.filter((code) => code !== subject.sub_code)
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {semester && resultYear && (
            <div className="text-center my-6">
              <h3 className="text-xl font-bold mb-4">Select Section</h3>
              <select
                className="border border-gray-400 p-3 rounded bg-white text-black w-64"
                value={selectedSection || ""}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="" disabled>
                  Select Section
                </option>
                {sectionList.map((section, index) => (
                  <option key={`section-${index}`} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleAllocate}
              className={`py-2 px-4 rounded ${
                isAllocateButtonDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
              disabled={isAllocateButtonDisabled || loading}
            >
              {loading ? "Allocating..." : "Allocate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySubjectAllocation;
