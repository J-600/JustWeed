const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const routes = require('./routes/redirect');
const { redirect } = require('react-router-dom');

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



app.post("/signup", (req, res) => {
  const {username, email, password } = req.body;
  fetch("http://localhost/justweed/backend/includes/create-user.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${email}&username=${username}&password=${password}`
  })
  .then (response => response.json())
  .then (data => {
    if (data.message && data.response === 200){
      req.session.username = username;
      req.session.email = email;
      req.session.save(err => {
        if (err) {
          console.error("Errore salvataggio sessione:", err);
          return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
        }
        res.json(data);
      });
    } else {
      res.status(401).json({error: data.data[0].message}) 
    }
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fetch("http://localhost/justweed/backend/includes/login.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `username=${username}&password=${password}`
  })
  .then(response => response.json())
  .then (data =>{
    if (data.message && data.response === 200){
      req.session.username = data.data[0].username;
      req.session.email = data.data[0].email;
      req.session.save(err => {
        if (err) {
          console.error("Errore salvataggio sessione:", err);
          return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
        }
        res.json(data);
      });
    } else if (!data.message && data.response === 500)
      res.status(401).json({error: "Credenziale non valide"}) 
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
});


app.get("/products", (req, res) =>{
  if (req.session){
    fetch("http://localhost/justweed/backend/view-product.php")
    .then(response => response.json())
    .then(data => {
        
    })
  }

});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/Justweed", redirect);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});