// // import { executeQuery } from '@/lib/db';
// // import type { User } from '@/types/user';
// // import { NextResponse } from 'next/server';

// // export async function GET() {
// //   try {
// //     const result = await executeQuery<User>('SELECT * FROM Users');
// //     if ('error' in result) {
// //       return NextResponse.json({ error: result.error }, { status: 500 });
// //     }
// //     return NextResponse.json(result);
// //   } catch (error) {
// //     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
// //   }
// // }

// import { testConnection } from "@/lib/db"

// // export default async function handler(req, res) {
// // try {
// //     const users = await executeQuery('SELECT * FROM students')
// //     console.log(users)
// //     res.status(200).json(users)
// // } catch (error) {
// //     res.status(500).json({ error: error.message })
// // }
// // }

// export async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method not allowed. Use GET request.' })
//   }
//   try {
//     await testConnection()
//     res.status(200).json({ message: 'Connected successfully!' })
//   } catch (error) {
//     res.status(500).json({ 
//       message: 'Connection failed',
//       error: error.message,
//       stack: error.stack
//     })
//   }
// }

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
