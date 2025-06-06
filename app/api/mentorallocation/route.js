
import { connectToDatabase } from '@/lib/db';
import sql from 'mssql';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { students, faculties, section } = body;

    // Validate the input fields
    if (
      !faculties ||
      !students ||
      !Array.isArray(students) ||
      students.length === 0 ||
      faculties.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields.' },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error('Failed to connect to the database.');
    }

    // Begin transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Dynamically adjust the query based on whether 'section' is used
      for (const usno of students) {
        let query = `
          UPDATE admission_master
          SET mentor = @facultyName
          WHERE usno = @usno
        `;

        // Append section only if it is provided
        if (section) {
          query = `
            UPDATE admission_master
            SET mentor = @facultyName, section = @section
            WHERE usno = @usno
          `;
        }

        // Assign the first faculty (customize logic as needed)
        const facultyName = faculties[0];

        const request = transaction.request()
          .input('usno', sql.NVarChar, usno)
          .input('facultyName', sql.NVarChar, facultyName);

        if (section) {
          request.input('section', sql.NVarChar, section || 'A');
        }

        await request.query(query);
      }

      // Commit transaction if all updates succeed
      await transaction.commit();
      return NextResponse.json(
        { message: 'Mentor allocation successful.' },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction on failure
      await transaction.rollback();
      console.error('Transaction error:', error);
      return NextResponse.json(
        { error: `Transaction error: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
