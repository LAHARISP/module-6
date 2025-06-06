"use client";

import React, { useState } from "react";

interface Course {
  crte: number; // Credits Earned
  grdpt: number; // Grade Points
}

interface Semester {
  courses: Course[];
}

const CGPACalculator: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]); // All semester data
  const [newCourses, setNewCourses] = useState<Course[]>([]); // Courses for the current semester
  const [error, setError] = useState<string>(""); // Error message

  // Add a new blank course for input
  const addCourse = () => {
    setNewCourses([...newCourses, { crte: 0, grdpt: 0 }]);
  };

  // Update course details
  const updateCourse = (index: number, field: keyof Course, value: number) => {
    const updatedCourses = [...newCourses];
    updatedCourses[index][field] = value;
    setNewCourses(updatedCourses);
  };

  // Calculate SGPA for the current semester
  const calculateSGPA = (): number => {
    const totalCredits = newCourses.reduce((sum, course) => sum + course.crte, 0);
    const totalGradePoints = newCourses.reduce(
      (sum, course) => sum + course.crte * course.grdpt,
      0
    );
    return totalCredits ? totalGradePoints / totalCredits : 0;
  };

  // Save the current semester and reset inputs
  const saveSemester = () => {
    const semesterSGPA = calculateSGPA();
    if (semesterSGPA === 0 || newCourses.length === 0) {
      setError("Please add valid courses with credits and grade points.");
      return;
    }
    setSemesters([...semesters, { courses: newCourses }]);
    setNewCourses([]); // Clear input for the next semester
    setError(""); // Clear any errors
  };

  // Calculate CGPA across all semesters
  const calculateCGPA = (): number => {
    const totalCredits = semesters.reduce(
      (sum, sem) => sum + sem.courses.reduce((semSum, course) => semSum + course.crte, 0),
      0
    );
    const totalGradePoints = semesters.reduce(
      (sum, sem) =>
        sum +
        sem.courses.reduce((semSum, course) => semSum + course.crte * course.grdpt, 0),
      0
    );
    return totalCredits ? totalGradePoints / totalCredits : 0;
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">CGPA & SGPA Calculator</h1>

      {/* Add Courses for the Current Semester */}
      <div className="mb-6">
        <h2 className="text-lg font-medium">Add Courses for Current Semester</h2>
        {newCourses.map((course, index) => (
          <div key={index} className="flex space-x-4 items-center mt-2">
            <input
              type="number"
              placeholder="Credits Earned"
              value={course.crte}
              onChange={(e) => updateCourse(index, "crte", +e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Grade Points"
              value={course.grdpt}
              onChange={(e) => updateCourse(index, "grdpt", +e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        ))}
        <button onClick={addCourse} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
          Add Course
        </button>
        {newCourses.length > 0 && (
          <div className="mt-4">
            <p>
              <strong>SGPA:</strong> {calculateSGPA().toFixed(2)}
            </p>
            <button
              onClick={saveSemester}
              className="bg-green-500 text-white py-2 px-4 rounded mt-2"
            >
              Save Semester
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Saved Semesters */}
      <div>
        <h2 className="text-lg font-medium">Saved Semesters</h2>
        {semesters.map((sem, index) => {
          const totalCredits = sem.courses.reduce((sum, course) => sum + course.crte, 0);
          const totalGradePoints = sem.courses.reduce(
            (sum, course) => sum + course.crte * course.grdpt,
            0
          );
          const sgpa = totalGradePoints / totalCredits;

          return (
            <div key={index} className="border p-4 rounded mt-2 bg-white">
              <h3 className="font-medium">Semester {index + 1}</h3>
              <p>Total Credits: {totalCredits}</p>
              <p>Total Grade Points: {totalGradePoints}</p>
              <p>SGPA: {sgpa.toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {/* CGPA */}
      {semesters.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-medium">Cumulative CGPA</h2>
          <p>
            <strong>CGPA:</strong> {calculateCGPA().toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;
