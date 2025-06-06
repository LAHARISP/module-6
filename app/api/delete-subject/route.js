// import { connectToDatabase } from "@/lib/db"; // Adjust the path based on your project structure
// import sql from "mssql";
// import { NextResponse } from "next/server";

// export async function DELETE(req) {
//   try {
//     const body = await req.json();
//     const { sub_code } = body;
//     console.log(sub_code);
//     // Validate subject code
//     if (!sub_code) {
//       return NextResponse.json(
//         { error: "Subject code is required." },
//         { status: 400 }
//       );
//     }

//     // Connect to the database
//     const pool = await connectToDatabase();
//     if (!pool) {
//       throw new Error("Failed to connect to the database.");
//     }

//     // SQL query to delete subject
//     const query = `DELETE FROM subject_master WHERE sub_code = @sub_code and dean_approval IS NULL`;

//     // Execute the query
//     const result = await pool
//       .request()
//       .input("sub_code", sql.NVarChar, sub_code)
//       .query(query);

//     // Check if rows were affected
//     if (result.rowsAffected[0] > 0) {
//       return NextResponse.json({ message: "Subject deleted successfully." });
//     } else {
//       return NextResponse.json(
//         { error: `"Subject not found,${sub_code} as dean_approval is yes"` },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Error in DELETE /api/delete-subject:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error." },
//       { status: 500 }
//     );
//   }
// }
// import { connectToDatabase } from "@/lib/db"; // Adjust the path based on your project structure
// import sql from "mssql";
// import { NextResponse } from "next/server";

// export async function DELETE(req) {
//   try {
//     const body = await req.json();
//     const { sub_code } = body;

//     // Validate subject code
//     if (!sub_code) {
//       return NextResponse.json(
//         { error: "Subject code is required." },
//         { status: 400 }
//       );
//     }

//     // Connect to the database
//     const pool = await connectToDatabase();
//     if (!pool) {
//       throw new Error("Failed to connect to the database.");
//     }

//     // Check if subject exists and get dean_approval status
//     const selectQuery = `
//       SELECT dean_approval 
//       FROM subject_master 
//       WHERE sub_code = @sub_code
//     `;
//     const selectResult = await pool
//       .request()
//       .input("sub_code", sql.NVarChar, sub_code)
//       .query(selectQuery);

//     if (selectResult.recordset.length === 0) {
//       // No subject found with the given sub_code
//       return NextResponse.json(
//         { error: `Subject not found for code: ${sub_code}` },
//         { status: 404 }
//       );
//     }

//     const { dean_approval } = selectResult.recordset[0];

//     // If dean_approval is 'yes', do not allow deletion
//     if (dean_approval === 'yes') {
//       return NextResponse.json(
//         { error: "Cannot delete subject. Dean approval is 'yes'." },
//         { status: 403 }
//       );
//     }

//     // Proceed with deletion if dean_approval is not 'yes'
//     const deleteQuery = `
//       DELETE FROM subject_master 
//       WHERE sub_code = @sub_code 
//       AND (dean_approval IS NULL OR dean_approval <> 'yes')
//     `;
//     const deleteResult = await pool
//       .request()
//       .input("sub_code", sql.NVarChar, sub_code)
//       .query(deleteQuery);

//     // Check if rows were affected
//     if (deleteResult.rowsAffected[0] > 0) {
//       return NextResponse.json({ message: "Subject deleted successfully." });
//     } else {
//       return NextResponse.json(
//         { error: `Subject not deleted for code: ${sub_code}` },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Error in DELETE /api/delete-subject:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error." },
//       { status: 500 }
//     );
//   }
// }
import { connectToDatabase } from "@/lib/db"; // Adjust the path based on your project structure
import sql from "mssql";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { sub_code } = body;
    console.log(sub_code);
    // Validate subject code
    if (!sub_code) {
      return NextResponse.json(
        { error: "Subject code is required." },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await connectToDatabase();
    if (!pool) {
      throw new Error("Failed to connect to the database.");
    }

    // First, check if the subject has dean_approval = 'yes'
    const checkQuery = `SELECT dean_approval FROM subject_master WHERE sub_code = @sub_code`;
    const checkResult = await pool
      .request()
      .input("sub_code", sql.NVarChar, sub_code)
      .query(checkQuery);

    if (checkResult.recordset.length === 0) {
      return NextResponse.json(
        { error: `Subject not found with code: ${sub_code}` },
        { status: 404 }
      );
    }

    const { dean_approval } = checkResult.recordset[0];
    if (dean_approval && dean_approval.toLowerCase() === 'yes') {
      // Dean has approved this subject, do not delete
      return NextResponse.json(
        { error: "Dean has approved this subject. Deletion not allowed." },
        { status: 403 }
      );
    }

    // If not approved by dean, proceed with the deletion
    const query = `DELETE FROM subject_master WHERE sub_code = @sub_code AND dean_approval IS NULL`;
    const result = await pool
      .request()
      .input("sub_code", sql.NVarChar, sub_code)
      .query(query);

    // Check if rows were affected
    if (result.rowsAffected[0] > 0) {
      return NextResponse.json({ message: "Subject deleted successfully." });
    } else {
      return NextResponse.json(
        { error: `Subject not found with code: ${sub_code} and not dean_approval = yes` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in DELETE /api/delete-subject:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
