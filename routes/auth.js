//Imports
import express from 'express';
import bcrypt from 'bcrypt';
import { sql } from '../db/db.js';

const router = express.Router();

//Register Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Starting Transaction
    await sql`BEGIN;`;

    //Storing hashed password
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
    `;

    await sql`COMMIT;`;
    //Transaction END

    res.status(201).json({ message: "Created" });
  } catch (e) {
    console.error('Registration Error:', e);
    res.status(500).json({ message: "Error while signing up" });
  }
});

export default router;
