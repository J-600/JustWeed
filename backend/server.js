import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import { console } from 'inspector';

import Stripe from 'stripe';

import authRouter from './routes/auth.routes.js';
import productsRouter from './routes/products.routes.js'
import userRouter from './routes/user.routes.js'

const STRIPE_SECRET_KEY = 'sk_test_51Qqap7J0BPVuq51Y0ydAG9kn97Q39HQ2WAP4N0J1s794JiNzwIYj2PoorgFr6A4ZJdvwbMUTwTERatnoFOUf2ltd00A6Q3laNG';
const stripe = new Stripe(STRIPE_SECRET_KEY);



const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(session({
  secret: "2vf345y65b-b75h6n32-2vg4572ttt",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 7200000
  }
}));

app.use("/api/auth", authRouter)
app.use("/api/products", productsRouter)
app.use("/api/user", userRouter)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});