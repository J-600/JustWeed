const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const routes = require('./routes/redirect');
const { redirect } = require('react-router-dom');

const app = express();
const PORT = process.env.PORT || 3000;


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

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/Justweed", redirect);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});