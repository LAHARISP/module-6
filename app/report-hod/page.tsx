"use client";
import React, { useRef, useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const HodReport: React.FC = () => {
  const [eventType, setEventType] = useState(""); // Event type filter
  const [fromDate, setFromDate] = useState(""); // From date filter
  const [toDate, setToDate] = useState(""); // To date filter
  const [data, setData] = useState<any[]>([]); // Detailed records data
  const [summary, setSummary] = useState<any[]>([]); // Summary data
  const [error, setError] = useState(""); // Error messages

  const branch = "CS"; // Constant branch value
  const tableRef = useRef<HTMLDivElement>(null); // Reference to the table

  // Fetch summary data on component load
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/hodreport?branch=${branch}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.status === "success") {
          setSummary(result.data);
        } else {
          setError(result.message || "Failed to fetch summary data.");
        }
      } catch (err) {
        setError("An error occurred while fetching summary data.");
        console.error(err);
      }
    };

    fetchSummary();
  }, [branch]);

  // Fetch detailed event data
  const handleFetchData = async () => {
    try {
      setError("");

      if (!eventType || !fromDate || !toDate) {
        setError("Please fill all filters to fetch data.");
        return;
      }

      const queryParams = new URLSearchParams({
        event_type: eventType,
        branch,
        from_date: fromDate,
        to_date: toDate,
      });

      const response = await fetch(`/api/hodreport?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();

      if (result.status === "success") {
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch data.");
        setData([]);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Export table data as CSV
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
    a.setAttribute("download", "hod_report.csv");
    a.click();
  };

  // Print table
  const handlePrintTable = () => {
    if (tableRef.current) {
      const printContent = tableRef.current.innerHTML;

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
      <div className="flex flex-col items-center">
        <Sidebar />
        <main className="flex-1 p-6 bg-white-100">
          <h1 className="text-2xl font-bold mb-4">Technical Event Report</h1>

          {/* Summary Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Event Summary</h2>
            {summary.length > 0 ? (
              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">Event Type</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item.event_type}</td>
                      <td className="border p-2">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No summary data available.</p>
            )}
          </div>

          {/* Filters Section */}
          <div className="flex items-center space-x-4 mb-6">
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

            <div>
              <label className="block font-medium text-gray-700">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <div>
              <button
                onClick={handleFetchData}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Fetch Data
              </button>
            </div>
          </div>

          {/* Error and Detailed Records */}
          {error && <p className="text-red-500">{error}</p>}
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
              <div ref={tableRef}>
                <table className="w-full border">
                  <thead>
                    <tr>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">USN</th>
                      <th className="border p-2">Branch</th>
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

export default HodReport;
