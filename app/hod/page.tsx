"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gradient-to-r from-white from-25% via-blue-500 to-purple-600 flex flex-col gap-y-2 sm:flex-row items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Image
            src="/aitlogo.png"
            alt="College Logo"
            width={450}
            height={250}
            className="object-contain"
          />
        </div>
      </header>

      <nav className="bg-stone-100 text-gray-800 w-full p-4 border-b border-gray-200">
        <ul className="flex flex-wrap space-x-4">
          <li>
            <div
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => toggleMenu("prepareMaster")}
            >
              Master Subject Table
            </div>
            {activeMenu === "prepareMaster" && (
              <ul className="ml-4 space-y-2">
                <li>
                  <Link href="/master-subject/create" className="hover:underline">
                    Subject Table
                  </Link>
                </li>
                <li>
                  <Link href="/master-subject/manage" className="hover:underline">
                    View Subject Table
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <div
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => toggleMenu("facultyAllocation")}
            >
              Faculty-Subject Allocation
            </div>
            {activeMenu === "facultyAllocation" && (
              <ul className="ml-4 space-y-2">
                <li>
                  <Link href="/faculty-subject-allocation/assign" className="hover:underline">
                    Assign Faculty
                  </Link>
                </li>
                <li>
                  <Link href="/faculty-subject-allocation/view" className="hover:underline">
                    View/Manage Allocations
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <div
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => toggleMenu("mentorStudent")}
            >
              Mentor-Student Allocation
            </div>
            {activeMenu === "mentorStudent" && (
              <ul className="ml-4 space-y-2">
                <li>
                  <Link href="/student-mentor-allocation/assign" className="hover:underline">
                    Assign Mentors
                  </Link>
                </li>
                <li>
                  <Link href="/student-mentor-allocation/view" className="hover:underline">
                    View/Manage Allocations
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <div
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => toggleMenu("subjectRegistration")}
            >
              Subject Registration
            </div>
            {activeMenu === "subjectRegistration" && (
              <ul className="ml-4 space-y-2">
                <li>
                  <Link href="/course-registration/register" className="hover:underline">
                    Register Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/course-registration/manage" className="hover:underline">
                    View/Manage Registrations
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link href="/dean">
              <div className="font-bold cursor-pointer hover:text-blue-500">
                Dean
              </div>
            </Link>
          </li>

          <li>
            <div
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => toggleMenu("mentee")}
            >
              Mentee
            </div>
            {activeMenu === "mentee" && (
              <ul className="ml-4 space-y-2">
                <li>
                  <Link href="/student-details" className="hover:underline">
                    Student Details
                  </Link>
                </li>
                <li>
                  <Link href="/student-technicalevents/insert" className="hover:underline">
                    Insert Technical Events
                  </Link>
                </li>
                <li>
                  <Link href="/student-technicalevents/view" className="hover:underline">
                    View Technical Events
                  </Link>
                </li>
                <li>
                  <Link href="/student-extracurricular/insert" className="hover:underline">
                    Insert Extracurricular
                  </Link>
                </li>
                <li>
                  <Link href="/report-hod" className="hover:underline">
                    hod report
                  </Link>
                </li>
                <li>
                  <Link href="/report-mentor" className="hover:underline">
                    mentor report
                  </Link>
                </li>
                <li>
                  <Link href="/mentor-page" className="hover:underline">
                    mentor-page
                  </Link>
                
                </li>
                <li>
                  <Link href="/cpga" className="hover:underline">
                    student result
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <main className="flex-1 bg-gray-100 p-8">
        <h2 className="text-2xl text-black font-semibold mb-4">Welcome to the Dashboard</h2>
        <p className="text-black">Select an option from the menu to get started.</p>
      </main>
    </div>
  );
};

export default Home;
