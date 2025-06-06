"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

const FacultySubjectAllocation: React.FC = () => {
  const [semester, setSemester] = useState<string>(""); // Semester selection
  const [resultYear, setResultYear] = useState<string>(""); // Result Year selection
  const [facultyList, setFacultyList] = useState<any[]>([]); // List of faculty
  const [subjectList, setSubjectList] = useState<any[]>([]); // List of subjects
  const [sectionList] = useState<string[]>(["A", "B", "C", "D"]); // Section options
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null); // Selected faculty
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]); // Selected subjects
  const [selectedSection, setSelectedSection] = useState<string | null>(null); // Selected section
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message

  const department = "CS"; // Hardcoded department for fetching data
  const Branch = "CS";

  // Fetch faculty list
  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/facultylist?department=${department}`);
        if (!response.ok) throw new Error("Failed to fetch faculty list.");
        const facultyData = await response.json();
        setFacultyList(facultyData);
      } catch (err) {
        console.error("Error fetching faculty list:", err);
        setError("Failed to fetch faculty data.");
      } finally {
        setLoading(false);
      }
    };

    if (semester && resultYear) fetchFacultyList();
  }, [semester, resultYear]);

  // Fetch subject list
  useEffect(() => {
    const fetchSubjectList = async () => {
      if (!semester || !resultYear) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/subjectlist-facultyallocation?semester=${semester}&result_year=${resultYear}&branch=${Branch}`
        );
        if (!response.ok) throw new Error("Failed to fetch subject list.");
        const subjectData = await response.json();
        setSubjectList(subjectData);
      } catch (err) {
        console.error("Error fetching subject list:", err);
        setError("Failed to fetch subject data.");
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

      const selectedFacultyName =
        facultyList.find((faculty) => faculty.employee_id === selectedFaculty)?.faculty_name;

      if (!selectedFacultyName) {
        alert("Invalid faculty selected. Please try again.");
        return;
      }

      const payload = {
        resultYear,
        semester,
        branchCode: department,
        subjects: selectedSubjects.map((code) => ({
          sub_code: code,
          sub_desc: subjectList.find((subject) => subject.sub_code === code)?.sub_desc || "",
        })),
        section: selectedSection,
        facultyId: selectedFaculty,
        facultyName: selectedFacultyName,
      };

      console.log("Payload:", payload);

      const response = await fetch("/api/allocate-subject-faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to allocate.");
      }

      alert("Allocation successful!");
      setSelectedFaculty(null);
      setSelectedSubjects([]);
      setSelectedSection(null);
    } catch (err) {
      console.error("Error during allocation:", err);
      alert(err.message || "Failed to allocate.");
    } finally {
      setLoading(false);
    }
  };

  const isAllocateButtonDisabled =
    !selectedFaculty || selectedSubjects.length === 0 || !selectedSection || loading;

  const shouldShowAllocateButton = facultyList.length > 0 && subjectList.length > 0;

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col">
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
                    <option key={`semester-${index + 1}`} value={index + 1}>
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
                      {facultyList.map((faculty, index) => (
                        <tr key={`faculty-${faculty.employee_id}-${index}`}>
                          <td className="border p-2">{faculty.faculty_name}</td>
                          <td className="border p-2">{faculty.employee_id}</td>
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              checked={selectedFaculty === faculty.employee_id}
                              onChange={() => setSelectedFaculty(faculty.employee_id)}
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
                        <th className="border p-2">Subject Type</th>
                        <th className="border p-2">Credits</th>
                        <th className="border p-2">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectList.map((subject, index) => (
                        <tr key={`subject-${subject.sub_code}-${index}`}>
                          <td className="border p-2">{subject.sub_desc}</td>
                          <td className="border p-2">{subject.sub_code}</td>
                          <td className="border p-2">{subject.SUBJECT_TYPE}</td>
                          <td className="border p-2">{subject.crhrs}</td>
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(subject.sub_code)}
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

          {shouldShowAllocateButton && (
            <>
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
              <div className="text-center">
                <button
                  onClick={handleAllocate}
                  className={`py-2 px-4 rounded ${
                    isAllocateButtonDisabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  disabled={isAllocateButtonDisabled}
                >
                  {loading ? "Allocating..." : "Allocate"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultySubjectAllocation;
