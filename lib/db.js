import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'deane',
    server: '192.168.29.12\\CHIDUSQL', // Use 'localhost' or actual server name
    database: 'aittest',
    port: 1433, // Default SQL Server port
    options: {
        encrypt: false, // For local testing, set to false
        trustServerCertificate: true,
    },
};
// const config = {
//     user: 'sa',
//     password: 'deane',
//     server: '38.188.203.50', // Use 'localhost' or actual server name
//     database: 'aittest',
//     port: 1433, // Default SQL Server port
//     options: {
//         encrypt: false, // For local testing, set to false
//         trustServerCertificate: true,
//     },
// };

// For other configurations, uncomment the desired block
// const config = {
//     user: 'sa',
//     password: 'collegeproject',
//     server: 'localhost', // Use 'localhost' or actual server name
//     database: 'aittest',
//     port: 1433, // Default SQL Server port
//     options: {
//         encrypt: false, // For local testing, set to false
//         trustServerCertificate: true,
//     },
// };

let pool;

export async function connectToDatabase() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log('Connected to database');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw new Error('Database connection failed');
        }
    }
    return pool;
}
