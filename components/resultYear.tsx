import React, { useState, useEffect } from "react";

function generateResultYears(): string[] {
  const currentYear = 2024;
  const startYear = currentYear - 5; // 5 years earlier
  const endYear = currentYear + 15; // 15 years later
  const months = ["01", "06", "08"]; // January, June, August
  const resultYears: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    months.forEach((month) => {
      resultYears.push(`${year}-${month}-01`);
    });
  }

  return resultYears;
}

interface ResultYearDropdownProps {
  value: string;
  onChange: (year: string) => void;
}

const ResultYearDropdown: React.FC<ResultYearDropdownProps> = ({ value, onChange }) => {
  const [resultYear, setResultYear] = useState<string[]>([]);

  useEffect(() => {
    const years = generateResultYears();
    setResultYear(years);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value); // Use the passed onChange function
  };

  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor="result-year" className="text-black font-medium">
        Select Result Year
      </label>
      <select
        id="result-year"
        value={value}
        onChange={handleChange}
        className="border border-gray-400 p-3 rounded bg-white text-black w-full"
      >
        <option value="" disabled>
          Select Result Year
        </option>
        {resultYear.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResultYearDropdown;
