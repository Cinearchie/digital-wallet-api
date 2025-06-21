import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import { sql } from '../db/db.js';


//Adding Product 
router.post('/product', auth , async(req , res) => {
    const {name , price , description} = req.body;

    //First Basic Check
    if(!name || !price || !description){
        return res.status(400).json({error:"Missing field"})
    }
    try{
        //Inserting into DB
        const result = await sql `
            INSERT INTO products(name , price , description)
            VALUES (${name} , ${price} , ${description})
            RETURNING id;
        `;

        res.status(201).json({
            id: result[0].id,
            message: 'Product added'
        });
    }catch(err){
        res.status(500).json({error: 'Failed to add'});
    }
})

//View Listing
router.get('/product' ,async(req , res) => {
    try{
        const products = await sql `SELECT * FROM products ORDER BY id DESC;`;
        res.json(products);
    }catch(err){
        res.status(500).json({error: 'Failed to fetch'})
    }
})

//Buying Product
router.post('/buy' , auth , async(req , res) => {
    const userId = req.user.id;
    const {product_id} = req.body;

    if(!product_id){
        return res.status(400).json({error:"Missing Product Id"})
    }

    try{
        //Transaction START
        await sql`BEGIN;`;

        //Product Fetch
        const productResult = await sql `SELECT * FROM products WHERE id = ${product_id};`;

        //Not Found Check
        if(productResult.length === 0){
            await sql `ROLLBACK;`;
            return res.status(400).json({error: "Insufficient balance or invalid product"});
        }


        const product = productResult[0];

        //User Balance
        const userResult = await sql `SELECT balance FROM users WHERE id = ${userId};`;
        const balance = parseFloat(userResult[0].balance);

        //User Balance Check
        if(balance < product.price){
            await sql `ROLLBACK;`;
            return res.status(400).json({error: "Insufficient balance or invalid product"});
        }

        //Update user Balance
        const updated = await sql `
            UPDATE users
            SET balance = balance - ${product.price}
            WHERE id = ${userId}
            RETURNING balance;
        `;

        //Inserting data to transactions
        await sql `
            INSERT INTO transactions (user_id , kind , amt , updated_bal)
            VALUES (${userId} , 'debit' , ${product.price} , ${updated[0].balance});
        `;

        await sql `COMMIT;`;
        //Transaction END

        res.json({
            message: 'Product purchased',
            balance: parseFloat(updated[0].balance)
        })
    }catch(err){
        await sql `ROLLBACK`;
        res.status(500).json({error:"Insufficient balance or invalid product"})
    }
})

export default router