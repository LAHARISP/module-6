"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const StudentDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const usno = searchParams.get("usno") || "Unknown"; // Extract USN from query parameters

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (usno !== "Unknown") {
      fetchStudentDetails();
    } else {
      setLoading(false);
      setError("USN not provided in query parameters.");
    }
  }, [usno]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/studentdetails?usno=${usno}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch student details.");
      }

      const data = await response.json();
      setStudent(data[0] || null); // Handle array response and pick the first element
      setError(null);
    } catch (err: any) {
      console.error("Error fetching student details:", err.message);
      setError(err.message || "Failed to fetch student details.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Student Details</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : student ? (
            <div className="bg-gray-100 p-6 rounded shadow-md">
              <table className="table-auto w-full border-collapse border border-gray-400 bg-white text-left">
                <tbody>
                  <tr>
                    <td className="border p-2 font-bold">USN</td>
                    <td className="border p-2">{student.usno}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Name</td>
                    <td className="border p-2">{student.s_name}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Father's Name</td>
                    <td className="border p-2">{student.f_name}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Mother's Name</td>
                    <td className="border p-2">{student.m_name}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">DOB</td>
                    <td className="border p-2">{formatDate(student.dob)}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Gender</td>
                    <td className="border p-2">{student.gender}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Email</td>
                    <td className="border p-2">{student.st_email}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Student Mobile</td>
                    <td className="border p-2">{student.st_mobile}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Parent Mobile</td>
                    <td className="border p-2">{student.parent_mobile}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Guardian Mobile</td>
                    <td className="border p-2">{student.gardian_mobile}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Blood Group</td>
                    <td className="border p-2">{student.blood_group}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Aadhar No</td>
                    <td className="border p-2">{student.adhar_no}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Father Occupation</td>
                    <td className="border p-2">{student.f_occupation}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Annual Income</td>
                    <td className="border p-2">{student.annual_income}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Nationality</td>
                    <td className="border p-2">{student.nationality}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Religion</td>
                    <td className="border p-2">{student.religion}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Caste</td>
                    <td className="border p-2">{student.caste}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Category</td>
                    <td className="border p-2">{student.category}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Permanent Address</td>
                    <td className="border p-2">{student.permanent_adrs}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-bold">Local Address</td>
                    <td className="border p-2">{student.local_adrs}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No student details available.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDetails;
