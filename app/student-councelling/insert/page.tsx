
"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CounsellingForm: React.FC = () => {
  const searchParams = useSearchParams();

  // Extract USN and other details from the query parameters
  const usno = searchParams.get("usno") || "Unknown";
  const s_name = searchParams.get("s_name") || "Unknown";
  const mentorFromQuery = searchParams.get("mentor") || "Unknown";

  const [student, setStudent] = useState<any>(null);
  const [mentor, setMentor] = useState<string>(mentorFromQuery); // Dynamically fetched mentor
  const [course, setCourse] = useState<string | null>(null); // Dynamically fetched course
  const [formData, setFormData] = useState({
    date: "",
    reason: "",
    advice:"",
  });
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
      if (!response.ok) throw new Error("Failed to fetch student details.");
      const data = await response.json();

      if (data.length > 0) {
        setStudent(data[0]);
        setMentor(data[0]?.mentor || "N/A"); // Fallback if no mentor is provided
        setCourse(data[0]?.course || "N/A");
      } else {
        setStudent(null);
        setError("No student details found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching student details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      usno,
      name: s_name,
      mentor,
      course: course || "Unknown",
    };

    console.log("Data being sent to the database:", requestData);

    try {
      const response = await fetch("/api/insert-councelling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Counselling details submitted successfully!");
        setFormData({ date: "", reason: "" ,advice:""});
      } else {
        alert("Failed to submit counselling details.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Counselling Form</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : student ? (
            <div className="bg-gray-100 p-6 rounded shadow-md">
              <h3 className="text-xl font-semibold">NAME: {s_name}</h3>
              <p className="text-lg">USN: {usno}</p>
              <p className="text-lg">Mentor: {mentor}</p>
              <p className="text-lg">Course: {course}</p>

              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>

                  <label>
                    reason:
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>

                  <label>
                    advice:
                    <textarea
                      name="advice"
                      value={formData.advice}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <p className="text-center text-gray-500">No student details available.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default CounsellingForm;
