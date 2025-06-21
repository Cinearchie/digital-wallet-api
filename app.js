
//Imports
import express from 'express';
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import productRoutes from './routes/product.js';


const app = express();
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(walletRoutes);
app.use(productRoutes);

// Check Route
app.get('/', (req, res) => {
  res.send('Okay');
});

//Listen Port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});
