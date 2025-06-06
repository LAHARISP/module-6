"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ExtracurricularDetails: React.FC = () => {
  const searchParams = useSearchParams();

  // Extract USN from query parameters
  const usno = searchParams.get("usno") || "Unknown";

  const [student, setStudent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (usno !== "Unknown") {
      fetchExtracurricularDetails();
    } else {
      setLoading(false);
      setError("USN not provided in query parameters.");
    }
  }, [usno]);

  const fetchExtracurricularDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/view-extracurricular?usno=${usno}`);
      if (!response.ok) throw new Error(`Failed to fetch extracurricular details: ${response.statusText}`);
      const data = await response.json();

      if (data.length > 0) {
        setStudent(data[0]); // Set student details (first record)
        const formattedEvents = data.map((event: any) => ({
          ...event,
          event_date: formatDate(event.event_date), // Format the event date
        }));
        setEvents(formattedEvents); // Set all extracurricular records for the student
      } else {
        setStudent(null);
        setEvents([]);
      }
    } catch (err: any) {
      console.error(err.message);
      setError(err.message || "Error fetching extracurricular details.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="w-full max-w-5xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Extracurricular Details</h2>

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

              <h3 className="text-lg font-semibold mt-6 mb-4">Extracurricular Records</h3>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Event Type</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">No of days</th>
                    <th className="border p-2">Place</th>
                    <th className="border p-2">Event Name</th>
                    <th className="border p-2">Level</th>
                    <th className="border p-2">Award</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index}>
                      <td className="border p-2">{event.event_type}</td>
                      <td className="border p-2">{event.event_date}</td>
                      <td className="border p-2">{event.no_of_days}</td>
                      <td className="border p-2">{event.place}</td>
                      <td className="border p-2">{event.event_name}</td>
                      <td className="border p-2">{event.level}</td>
                      <td className="border p-2">{event.award_received}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No extracurricular records available.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExtracurricularDetails;
