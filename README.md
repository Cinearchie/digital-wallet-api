# 💳 Digital Wallet API

A secure, RESTful backend API for a **digital wallet system**, built with **Node.js**, **Express**, and **PostgreSQL** (NeonDB). This project simulates user wallet operations including balance funding, money transfers, product purchases, and real-time currency conversions.

---

## 🌐 Live Deployment

🔗 [API Base URL (Render)](https://digital-wallet-api.onrender.com/api/v1)

---

## ✨ Features

- ✅ User registration with hashed passwords
- ✅ Basic Authentication using HTTP headers
- ✅ Fund wallet with INR
- ✅ Transfer money to other users
- ✅ Get current balance (optional: converted currency)
- ✅ View all transaction history
- ✅ Add and list products
- ✅ Buy products with wallet balance

---

## 🧱 Tech Stack

| Tech        | Use Case                      |
|-------------|-------------------------------|
| **Node.js** | Backend runtime               |
| **Express** | Routing + Middleware          |
| **PostgreSQL** | Persistent SQL storage   |
| **NeonDB**  | Serverless PostgreSQL (cloud) |
| **bcrypt**  | Password hashing              |
| **axios**   | External currency API calls   |
| **Render**  | App deployment                |

---

## 🗂️ Routes


| Method | Endpoint                   | Auth | Description                     |
| ------ | -------------------------- | ---- | ------------------------------- |
| POST   | `/register`                | ❌    | Register a new user             |
| POST   | `/fund`                    | ✅    | Add money to wallet             |
| POST   | `/pay`                     | ✅    | Pay another user                |
| GET    | `/bal?currency=USD`        | ✅    | Check balance in given currency |
| GET    | `/stmt`                    | ✅    | Get transaction history         |
| POST   | `/product`                 | ✅    | Add a product                   |
| GET    | `/product`                 | ❌    | List all products               |
| POST   | `/product/buy`             | ✅    | Buy a product                   |


---

## 📦 Installation & Running Locally

```bash
# 1. Clone repo
git clone https://github.com/Cinearchie/digital-wallet-api.git
cd digital-wallet-api

# 2. Install dependencies
npm install

# 3. Add environment variables
touch .env

## .env content

PORT=3000
DB_URL=your_neondb_postgres_connection_string
API_KEY=your_currencyapi_key


#Start the server
nodemon app.js

---


