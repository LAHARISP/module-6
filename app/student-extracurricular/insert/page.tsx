"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ExtracurricularForm: React.FC = () => {
  const searchParams = useSearchParams();

  // Extract USN and other details from the query parameters
  const usno = searchParams.get("usno") || "Unknown";
  const s_name = searchParams.get("s_name") || "Unknown";
  const mentorFromQuery = searchParams.get("mentor") || "Unknown";

  const [student, setStudent] = useState<any>(null);
  const [mentor, setMentor] = useState<string>(mentorFromQuery); // Dynamically fetched mentor
  const [course, setCourse] = useState<string | null>(null); // Dynamically fetched course
  const [formData, setFormData] = useState({
    programType: "",
    date: "",
    event: "",
    place: "",
    level: "",
    achievement: "",
    no_of_days: "", // Correctly initialized
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      const response = await fetch("/api/insert-extracurricular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Extracurricular details submitted successfully!");
        setFormData({
          programType: "",
          date: "",
          event: "",
          place: "",
          level: "",
          achievement: "",
          no_of_days: "",
        });
      } else {
        alert("Failed to submit extracurricular details.");
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
          <h2 className="text-2xl font-bold mb-6 text-center">
            Extracurricular Form
          </h2>

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
                    Program Type:
                    <select
                      name="programType"
                      value={formData.programType}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">Select Program Type</option>
                      <option value="Sports">Sports</option>
                      <option value="NSS">NSS</option>
                      <option value="Others">Others</option>
                    </select>
                  </label>

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
                    Event:
                    <input
                      type="text"
                      name="event"
                      value={formData.event}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>

                  <label>
                    Place:
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>

                  <label>
                    Number of Days Attended:
                    <input
                      type="number"
                      name="no_of_days"
                      value={formData.no_of_days}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>

                  <label>
                    Level:
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="College">College</option>
                      <option value="University">University</option>
                      <option value="State">State</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </label>

                  <label>
                    Achievement:
                    <select
                      name="achievement"
                      value={formData.achievement}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">Select Achievement</option>
                      <option value="Award">Award</option>
                      <option value="Prize">Prize</option>
                      <option value="Certificate">Certificate</option>
                    </select>
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

export default ExtracurricularForm;
