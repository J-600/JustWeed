import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import { console } from 'inspector';

import authRouter from './routes/auth.routes.js';
import productsRouter from './routes/products.routes.js'
import userRouter from './routes/user.routes.js'
import weederRouter from './routes/weeder.routes.js'




const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(session({
  secret: "YOUR_SECRET_KEY",
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
app.use("/api/weeder", weederRouter)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});