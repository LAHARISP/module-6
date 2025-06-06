"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const TechnicalEventDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const usno = searchParams.get("usno") || "Unknown";

  const [student, setStudent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (usno !== "Unknown") {
      fetchStudentDetails();
    } else {
      setLoading(false);
      console.log("USN not provided in query parameters.");
    }
  }, [usno]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const encodedUsno = encodeURIComponent(usno); // Encode the USN for safe usage
      const response = await fetch(`/api/view-technical?usno=${encodedUsno}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch student details: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.data.length > 0) {
        setStudent(data.data[0]); // Set the first student's details
        setEvents(data.data); // Set all the event records
      } else {
        setStudent(null);
        setEvents([]);
        alert(`No details found for USN: ${usno}`); // Show a popup instead of logging
      }
    } catch (err: any) {
      console.error(err.message);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Technical Event Details</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : student ? (
            <div className="bg-gray-100 p-6 rounded shadow-md">
              <table className="table-auto w-full mb-6">
                <tbody>
                  <tr>
                    <td className="font-semibold p-2">Name:</td>
                    <td className="p-2">{student.s_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold p-2">USN:</td>
                    <td className="p-2">{student.usno}</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-semibold mt-6 mb-4">Event Records</h3>
              {events.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Event Type</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">No of Days</th>
                      <th className="border p-2">Place</th>
                      <th className="border p-2">Event Name</th>
                      <th className="border p-2">Role</th>
                      <th className="border p-2">Title of Paper/Event</th>
                      <th className="border p-2">Mentor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr key={index}>
                        <td className="border p-2">{event.event_type}</td>
                        <td className="border p-2">{formatDate(event.event_date)}</td>
                        <td className="border p-2">{event.no_of_days}</td>
                        <td className="border p-2">{event.place}</td>
                        <td className="border p-2">{event.event_name}</td>
                        <td className="border p-2">{event.role}</td>
                        <td className="border p-2">{event.title_of_paper_presented}</td>
                        <td className="border p-2">{event.mentor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  No event records available for this USN.
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">No student details available.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default TechnicalEventDetails;
