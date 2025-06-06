// components/Sidebar.tsx
import Link from "next/link";
import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <nav className="bg-stone-100 text-gray-800 w-full p-4 border-b border-gray-200">
      <ul className="flex space-x-8">
        {/* Master Subject Table */}
        <li className="relative">
          <div
            className="font-bold cursor-pointer hover:text-blue-500"
            onClick={() => toggleMenu("prepareMaster")}
          >
            Master Subject Table
          </div>
          {activeMenu === "prepareMaster" && (
            <ul className="absolute bg-white border border-gray-300 mt-2 shadow-lg p-2">
              <li>
                <Link href="/master-subject/create" className="hover:underline">
                  Subject Table
                </Link>
              </li>
              <li>
                <Link href="/master-subject/manage" className="hover:underline">
                  View subject Table
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Faculty-Subject Allocation */}
        <li className="relative">
          <div
            className="font-bold cursor-pointer hover:text-blue-500"
            onClick={() => toggleMenu("facultyAllocation")}
          >
            Faculty-Subject Allocation
          </div>
          {activeMenu === "facultyAllocation" && (
            <ul className="absolute bg-white border border-gray-300 mt-2 shadow-lg p-2">
              <li>
                <Link href="/faculty-subject-allocation/assign" className="hover:underline">
                  Assign Faculty
                </Link>
              </li>
              <li>
                <Link href="/faculty-subject-allocation/view" className="hover:underline">
                  View and Manage Allocations
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Mentor-Student Allocation */}
        <li className="relative">
          <div
            className="font-bold cursor-pointer hover:text-blue-500"
            onClick={() => toggleMenu("mentorStudent")}
          >
            Mentor-Student Allocation
          </div>
          {activeMenu === "mentorStudent" && (
            <ul className="absolute bg-white border border-gray-300 mt-2 shadow-lg p-2">
              <li>
                <Link href="/student-mentor-allocation/assign" className="hover:underline">
                  Assign Mentors
                </Link>
              </li>
              <li>
                <Link href="/student-mentor-allocation/view" className="hover:underline">
                  View and Manage Allocations
                </Link>
              </li>
            </ul>
          )}
        </li>



        {/* Subject Registration */}
        <li className="relative">
          <div
            className="font-bold cursor-pointer hover:text-blue-500"
            onClick={() => toggleMenu("subjectRegistration")}
          >
            Subject Registration
          </div>
          {activeMenu === "subjectRegistration" && (
            <ul className="absolute bg-white border border-gray-300 mt-2 shadow-lg p-2">
              <li>
                <Link href="/subject-registration/register" className="hover:underline">
                  Register Subjects
                </Link>
              </li>
              <li>
                <Link href="/subject-registration/manage" className="hover:underline">
                  View and Manage Registrations
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* dean */}
        <li className="relative">
          <Link href="/dean">
          <div
            className="font-bold cursor-pointer hover:text-blue-500">
            Dean
          </div>
      
          </Link>
        </li>

        {/* Mentee Section */}
        <li>
            <div
              className="font-bold cursor-pointer hover:text-blue-500"
              onClick={() => toggleMenu("mentee")}
            >
              Mentee
            </div>
            {activeMenu === "mentee" && (
              <ul className="absolute bg-white border border-gray-300 mt-2 shadow-lg p-2">
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
  );
};

export default Sidebar;
