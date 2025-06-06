
"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TechnicalEventForm: React.FC = () => {
  const searchParams = useSearchParams();

  const usno = searchParams.get("usno") || "Unknown";
  const s_name = searchParams.get("s_name") || "Unknown";
  const mentor = searchParams.get("mentor") || "Unknown";

  const [course, setCourse] = useState<string | null>(null); // Dynamically fetched
  const [formData, setFormData] = useState({
    programType: "",
    date: "",
    place: "",
    role: "",
    title: "",
    no_of_days: "",
    title_of_paper_presented: "", // New field for the title of the paper
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/studentdetails?usno=${usno}`);
        if (!response.ok) throw new Error("Failed to fetch student details.");
        const data = await response.json();

        if (data.length > 0) {
          setCourse(data[0]?.course || "Unknown");
        } else {
          setError("No student details found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [usno]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      branch: course || "Unknown",
    };

    console.log("Sending data to API:", requestData);

    try {
      const response = await fetch("/api/insert-technical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event successfully submitted!");
        setFormData({
          programType: "",
          date: "",
          place: "",
          role: "",
          title: "",
          no_of_days: "",
          title_of_paper_presented: "",
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while submitting the event.");
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Technical Event Form</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
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
                      <option value="Workshop">Workshop</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Conference">Conference</option>
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
                    Event name:
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    />
                  </label>

                  <label>
                    Role:
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Participated">Participated</option>
                      <option value="Organized">Organized</option>
                    </select>
                  </label>

                  <label>
                    Number of Days:
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
                    Title of Paper Presented(if no paper presented,fill N/A):
                    <input
                      type="text"
                      name="title_of_paper_presented"
                      value={formData.title_of_paper_presented}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default TechnicalEventForm;
