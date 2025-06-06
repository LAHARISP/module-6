import { connectToDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const pool = await connectToDatabase(); // Connect to the database
        const result = await pool.request().query('SELECT pky,brcode,brcode_title FROM branch'); // Replace 'Students' with your table name
        console.log(result)
        return new NextResponse(JSON.stringify(result.recordset), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });// Return the result as JSON
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
