import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

// Handle POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the request body
    const { username, password } = body;

    // Validate the payload
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const result = await db
      .request()
      .input("username", username.toLowerCase()) // Convert username to lowercase
      .input("password", password)
      .query(
        "SELECT username, password, role FROM users WHERE username = @username AND password = @password"
      );

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      return NextResponse.json(
        { success: true, message: "Login successful", role: user.role },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("Error during login:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
