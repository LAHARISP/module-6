import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { course, admYear, semester, students, subjects } = body;

    if (!course || !admYear || !semester || students.length === 0 || subjects.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters or no selections made." },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      for (const usn of students) {
        for (const subCode of subjects) {
          await transaction.request()
            .input("course", sql.VarChar, course)
            .input("admYear", sql.VarChar, admYear)
            .input("semester", sql.Int, semester)
            .input("usn", sql.VarChar, usn)
            .input("subCode", sql.VarChar, subCode)
            .query(`
              INSERT INTO course_registration (course, adm_year, semester, usn, sub_code)
              VALUES (@course, @admYear, @semester, @usn, @subCode)
            `);
        }
      }

      await transaction.commit();

      return NextResponse.json({ message: "Allocation successful!" }, { status: 201 });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error in allocation:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
