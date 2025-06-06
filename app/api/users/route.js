
import sql from 'mssql';
import { NextResponse } from 'next/server';

// Database configuration for Windows Authentication
const config = {
  server: process.env.MSSQL_SERVER as string,
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Use this if you're on a local dev machine
    trustedConnection: true, // This enables Windows Authentication
  },
}

export async function GET() {
  let pool: sql.ConnectionPool | null = null;
  try {
    // Create connection pool
    pool = await sql.connect(config)

    // Fetch student details from the database
    const result = await pool.request().query(`
      SELECT TOP 1
        s_name, 
        dob, 
        usno, 
        st_email, 
        st_phone, 
        m_Name, 
        f_Name, 
        parent_mobile, 
        category, 
        guardian_mobile, 
        nationality, 
        blood_group, 
        permanent_adrs 
      FROM students
    `)

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.recordset[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student details' },
      { status: 500 }
    )
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}
