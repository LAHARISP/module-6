import { connectToDatabase } from "@/lib/db";
import sql from "mssql";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Allocation ID is required." }),
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();

    const query = `
      DELETE FROM subject_faculty_map
      WHERE PKY = @id
    `;
    const result = await pool.request().input("id", sql.Int, id).query(query);

    if (result.rowsAffected[0] === 0) {
      return new Response(
        JSON.stringify({ error: "Allocation not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Allocation deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting allocation:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
