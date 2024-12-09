// utils/db.js
import dotenv from 'dotenv'
import sql from 'mssql'

// Load environment variables from .env file
dotenv.config()

const config = {
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    integratedSecurity: true
  },
  driver: 'msnodesqlv8'
}

// Create a connection pool
const pool = new sql.ConnectionPool(config)
const poolConnect = pool.connect()

// Function to get connection pool
async function getConnection() {
  try {
    await poolConnect
    return pool
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw error
  }
}

// Example query function with better error handling
async function executeQuery(query) {
  try {
    const connection = await getConnection()
    const result = await connection.request().query(query)
    return result.recordset
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Test connection function
async function testConnection() {
  try {
    const connection = await getConnection()
    console.log('Successfully connected to database!')
    return true
  } catch (error) {
    console.error('Failed to connect to database:', error)
    return false
  }
}

export { executeQuery, testConnection }

