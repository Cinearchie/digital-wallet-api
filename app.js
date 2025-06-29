
//Imports
import express from 'express';
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import productRoutes from './routes/product.js';
import apiRouter from './routes/index.js'

const app = express();
app.use(express.json());

// Routes
app.use('/api/v1' , apiRouter)

// Check Route
app.get('/', (req, res) => {
  res.send('Server is UP');
});

//Listen Port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});
