import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
//Connecting to neon Database
export const sql = neon(process.env.DB_URL);
