"use client";
import React, { useRef, useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const EventFilter: React.FC = () => {
  const [eventType, setEventType] = useState(""); // Event type (no default)
  const [fromDate, setFromDate] = useState(""); // From date
  const [toDate, setToDate] = useState(""); // To date
  const [data, setData] = useState<any[]>([]); // Stores fetched data
  const [error, setError] = useState(""); // Error handling

  const mentor = "vinodkumar kp"; // Set mentor as a constant
  const tableRef = useRef<HTMLDivElement>(null); // Reference to the table

  // Function to fetch data from the API
  const handleFetchData = async () => {
    try {
      setError("");

      if (!eventType) {
        setError("Please select an event type.");
        return;
      }

      const queryParams = new URLSearchParams({
        event_type: eventType,
        mentor,
        from_date: fromDate,
        to_date: toDate,
      });

      const response = await fetch(`/api/mentor-report?${queryParams.toString()}`);
      const result = await response.json();

      if (result.status === "success") {
        setData(result.data); // Store the fetched data
      } else {
        setError(result.message || "Failed to fetch data.");
        setData([]);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    }
  };

  // Function to format the date to 'YYYY-MM-DD'
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract the YYYY-MM-DD part
  };

  // Function to export table data as a CSV file
  const handleExportCSV = () => {
    if (data.length === 0) {
      setError("No data available to export.");
      return;
    }

    const csvHeaders = [
      "Name",
      "USN",
      "Course",
      "Event Type",
      "Event Date",
      "Place",
      "Mentor",
      "Role",
      "No. of Days",
    ];

    const csvRows = data.map((record) =>
      [
        record.s_name,
        record.usno,
        record.branch,
        record.event_type,
        formatDate(record.event_date),
        record.place,
        record.mentor,
        record.role,
        record.no_of_days,
      ].join(",")
    );

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "event_report.csv");
    a.click();
  };

  // Function to print only the table with a logo and heading
  const handlePrintTable = () => {
    if (tableRef.current) {
      const printContent = tableRef.current.innerHTML;

      // Open a new window to isolate table content
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  text-align: center;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px auto;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f4f4f4;
                }
                img {
                  width: 600px;
                  margin-bottom: 20px;
                }
                h1 {
                  margin-bottom: 20px;
                }
              </style>
            </head>
            <body>
              <img src="/images/aitlogo.png" alt="College Logo" />
              <h1>Technical Event Report</h1>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    }
  };

  return (
    <div className="h-screen bg-white text-black">
      <Header />
      <div className="flex flex flex-col items-center">
        <Sidebar />
        <main className="flex-1 p-6 bg-white-100">
          <h1 className="text-2xl font-bold mb-4">Technical Events Report</h1>

          {/* Filters Section */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Dropdown for Event Type */}
            <div>
              <label className="block font-medium text-gray-700">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="" disabled>
                  Select Event Type
                </option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block font-medium text-gray-700">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            {/* Fetch Data Button */}
            <div>
              <button
                onClick={handleFetchData}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Fetch Data
              </button>
            </div>
          </div>

          {/* Display Data */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {data.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-4">Event Records</h2>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={handleExportCSV}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Export as CSV
                </button>
                <button
                  onClick={handlePrintTable}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Print Report
                </button>
              </div>
              {/* Table Container */}
              <div ref={tableRef}>
                <table className="w-full mt-2 border">
                  <thead>
                    <tr>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">USN</th>
                      <th className="border p-2">Course</th>
                      <th className="border p-2">Event Type</th>
                      <th className="border p-2">Event Date</th>
                      <th className="border p-2">Place</th>
                      <th className="border p-2">Mentor</th>
                      <th className="border p-2">Role</th>
                      <th className="border p-2">No. of Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((record, index) => (
                      <tr key={index}>
                        <td className="border p-2">{record.s_name}</td>
                        <td className="border p-2">{record.usno}</td>
                        <td className="border p-2">{record.branch}</td>
                        <td className="border p-2">{record.event_type}</td>
                        <td className="border p-2">{formatDate(record.event_date)}</td>
                        <td className="border p-2">{record.place}</td>
                        <td className="border p-2">{record.mentor}</td>
                        <td className="border p-2">{record.role}</td>
                        <td className="border p-2">{record.no_of_days}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventFilter;
