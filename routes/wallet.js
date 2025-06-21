import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { sql } from '../db/db.js';
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

//Deposit Fund
router.post('/fund' , auth , async (req , res) => {
    const {amt} = req.body;
    const user = req.user;

    //Basic Check
    if(!amt || isNaN(amt) || amt <= 0){
        return res.status(400).json({error:"Amount must be positive"})
    }

    try{
        //transaction START
        await sql`BEGIN`;
        const result = await sql `
            UPDATE users
            SET balance = balance + ${amt}
            WHERE id = ${user.id}
            RETURNING balance;
        `;

        const updatedBalance = result[0].balance;

        //Inserting data to transactions
        await sql`
            INSERT INTO transactions(user_id , kind , amt , updated_bal)
            VALUES(${user.id},'credit',${amt},${updatedBalance});
        `;

        await sql `COMMIT;`;

        res.json({balance: Number(updatedBalance)});

    }catch(e){
        await sql `ROLLBACK;`;
        res.status(500).json({error:'Something went wrong'})
    }
})

//Pay to Another User
router.post('/pay' , auth , async(req , res) => {
    const {to , amt} = req.body;
    const sender = req.user;

    //Basic Check
    if(!to || !amt || isNaN(amt) || amt <= 0){
        return res.status(400).json({error: "insufficient funds  or recipient doesn't exist"})
    }

    try{
        //Getting the Recipient
        const result = await sql `SELECT * FROM users WHERE username = ${to};`;
        const recipient = result[0];

        //Recipient Not Found Check
        if(!recipient){
            return res.status(400).json({error:"No such user exists"})
        }
        //User & Recipient Same Check
        if(sender.username === recipient.username){
            return res.status(400).json({error:"Cannot send to yourself"})
        }
        //Getting Sender Balance
        const senderBal = Number(sender.balance);
        if(senderBal < amt){
            return res.status(400).json({error:"Insufficient balance"});
        }

        //Transaction START
        await sql`BEGIN;`;

        //Updating sender balance
        const senderUpdate = await sql`
            UPDATE users
            SET balance = balance - ${amt}
            WHERE id = ${sender.id}
            RETURNING balance;
        `;
        //Updating recipient balance
        const recipientUpdate = await sql `
            UPDATE users 
            SET balance = balance + ${amt}
            WHERE id = ${recipient.id}
            RETURNING balance;
        `;

        //Adding data to transactions for sender
        await sql `
            INSERT INTO transactions (user_id , kind , amt , updated_bal)
            VALUES(${sender.id}, 'debit', ${amt} , ${senderUpdate[0].balance})
        `
        //Adding data to transactions for recipient
        await sql `
            INSERT INTO transactions (user_id , kind , amt , updated_bal)
            VALUES(${recipient.id}, 'credit', ${amt} , ${recipientUpdate[0].balance})
        `

        await sql`COMMIT;`;
        //Transaction END

        res.json({
            balance: Number(senderUpdate[0].balance)
        });
    }catch(e){
        await sql`ROLLBACK;`;
        res.status(500).json({error:"Error during transfer"})
    }
})

//Checking Balance
router.get('/bal' , auth , async (req , res) => {
    const user = req.user;
    //If not mentioned , by default 'INR'
    const currency = req.query.currency?.toUpperCase() || 'INR';

    const inrBalance = Number(user.balance);

    if(currency === 'INR'){
        return res.json({balance: inrBalance , currency: 'INR'});
    }

    try{

        //API call to currencyAPI
        const response = await axios.get(process.env.API_KEY)

        //Currency conversion rate
        const rate = response.data.data[currency]?.value;

        //If rate not found check
        if(!rate){
            return res.status(400).json({error:"Invalid currency"})
        }
        const converted = inrBalance * rate;

        res.json({
            balance: parseFloat(converted.toFixed(2)),
            currency
        })
    }catch(e){
        res.status(500).json({error:"Failed to convert currency"})
    }
})

//Statement
router.get('/stmt' , auth , async(req , res) => {
    const userId = req.user.id;

    try{
        //Fetching data from transactions table
        const transactions = await sql `
            SELECT kind , amt , updated_bal , timestamp
            FROM transactions 
            WHERE user_id = ${userId}
            ORDER BY timestamp DESC;
        `;
        res.json(transactions);
    }catch(e){
        res.status(400).json({error:"Could not fetch"})
    }
})

export default router;