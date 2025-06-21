import bcrypt from 'bcrypt';
import { sql } from '../db/db.js';

export default async function auth(req , res , next){
    const header = req.headers.authorization;

    //First Check 
    if(!header || !header.startsWith('Basic ')){
        return res.status(401).json({error: 'Missing or invalid Authorization'})
    }
    //Second Check
    const base = header.split(' ')[1]
    const [username , password] = Buffer.from(base , 'base64').toString().split(':')

    try{
        //Fetching user
        const user = await sql`SELECT * FROM users WHERE username = ${username}`;
        //password check
        if(!user.length || !(await bcrypt.compare(password , user[0].password))){
            return res.status(401).json({error: 'Invalid credentials'});
        }
        req.user = user[0];
        next();
    }catch(err){
        res.status(500).json({error: 'Authentication failed'})
    }
}