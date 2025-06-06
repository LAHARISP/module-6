import sql from 'mssql';

const config = {
    user: 'sa',
    password: 'db_password'',
    server: 'server_name', // Use 'localhost' or actual server name
    database: 'db_name',
    port: 1433, // Default SQL Server port
    options: {
        encrypt: false, // For local testing, set to false
        trustServerCertificate: true,
    },
};

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
