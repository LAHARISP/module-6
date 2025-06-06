import { connectToDatabase } from "@/lib/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export const config = {
  runtime: "edge", // Ensure Next.js handles this API properly
};

export async function POST(req) {
  try {
    const body = await req.json(); // Parse JSON body
    const { students = [], subjects = [], semester, resultYear, course } = body;

    // Validate required fields
    if (!students.length || !subjects.length || !semester || !resultYear || !course) {
      return NextResponse.json(
        { error: "Missing required fields: students, subjects, semester, resultYear, or course." },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    const query = `
      INSERT INTO course_registration (
        bcde,
        usn,
        s_name,
        semester,
        brcode,
        subcode,
        subtype,
        suborder,
        result_year,
        scheme_code,
        lab_flag,
        sect,
        test1,
        test2,
        test3,
        assignment,
        group_activity,
        cie45,
        cie,
        see,
        cie_see,
        grd,
        crta,
        crte,
        grdpt,
        old_grd,
        phy_cyc,
        mkup_flg,
        reval_flg,
        malpractice_flg,
        att_elg,
        cie_elg,
        Emp_id,
        Emp_name,
        test1_date,
        test2_date,
        test3_date,
        class_held,
        class_att,
        att_perc
      ) VALUES (
        @bcde,
        @usn,
        @s_name,
        @semester,
        @brcode,
        @subcode,
        @subtype,
        @suborder,
        @resultYear,
        @schemeCode,
        @lab_flag,
        @sect,
        @test1,
        @test2,
        @test3,
        @assignment,
        @group_activity,
        @cie45,
        @cie,
        @see,
        @cie_see,
        @grd,
        @crta,
        @crte,
        @grdpt,
        @old_grd,
        @phy_cyc,
        @mkup_flg,
        @reval_flg,
        @malpractice_flg,
        @att_elg,
        @cie_elg,
        @Emp_id,
        @Emp_name,
        @test1_date,
        @test2_date,
        @test3_date,
        @class_held,
        @class_att,
        @att_perc
      )
    `;

    const transaction = pool.transaction();
    await transaction.begin();

    try {
      const request = transaction.request();

      for (const student of students) {
        for (const subject of subjects) {
          await request
            .input("bcde", sql.NVarChar, null)
            .input("usn", sql.NVarChar, student?.usn || null)
            .input("s_name", sql.NVarChar, student?.s_name || null)
            .input("semester", sql.Int, semester || null)
            .input("brcode", sql.NVarChar, course || null)
            .input("subcode", sql.NVarChar, subject?.sub_code || null)
            .input("subtype", sql.NVarChar, "Regular") // Assuming default subtype
            .input("suborder", sql.Int, subject?.suborder || null)
            .input("resultYear", sql.NVarChar, resultYear || null)
            .input("schemeCode", sql.NVarChar, null)
            .input("lab_flag", sql.NVarChar, null) // Explicitly set to NULL
            .input("sect", sql.NVarChar, null)
            .input("test1", sql.Int, null)
            .input("test2", sql.Int, null)
            .input("test3", sql.Int, null)
            .input("assignment", sql.Int, null)
            .input("group_activity", sql.Int, null)
            .input("cie45", sql.Int, null)
            .input("cie", sql.Int, null)
            .input("see", sql.Int, null)
            .input("cie_see", sql.Int, null)
            .input("grd", sql.NVarChar, null)
            .input("crta", sql.Int, null)
            .input("crte", sql.Int, null)
            .input("grdpt", sql.Float, null)
            .input("old_grd", sql.NVarChar, null)
            .input("phy_cyc", sql.NVarChar, null)
            .input("mkup_flg", sql.Bit, null)
            .input("reval_flg", sql.Bit, null)
            .input("malpractice_flg", sql.Bit, null)
            .input("att_elg", sql.Bit, null)
            .input("cie_elg", sql.Bit, null)
            .input("Emp_id", sql.NVarChar, null)
            .input("Emp_name", sql.NVarChar, null)
            .input("test1_date", sql.DateTime, null)
            .input("test2_date", sql.DateTime, null)
            .input("test3_date", sql.DateTime, null)
            .input("class_held", sql.Int, null)
            .input("class_att", sql.Int, null)
            .input("att_perc", sql.Float, null)
            .query(query);
        }
      }

      await transaction.commit();
      return NextResponse.json({ message: "Course registration data inserted successfully!" }, { status: 200 });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error inserting course registration data:", error);
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
