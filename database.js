import mysql from "mysql2/promise";
import {config} from 'dotenv'
config()

const db=await mysql.createConnection({
    host: process.env.HOST, 
    user: process.env.USER,      
    password: process.env.PASSWORD,  
    database: process.env.DATABASE
  });
  export { db };


