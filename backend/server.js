const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');

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


async function sendConfirmationEmail(email, token) {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // o il tuo provider SMTP
    auth: {
      user: 'noReplyJustWeed@gmail.com',
      pass: 'JustWeed2025'
    }
  });

  let mailOptions = {
    from: 'noReplyJustWeed@gmail.com',
    to: email,
    subject: 'Conferma la tua registrazione',
    text: `Clicca sul seguente link per confermare la tua registrazione: http://localhost:3001/confirm?token=${token}&email=${email}`
  };

  await transporter.sendMail(mailOptions);
}

app.get("confirm", (req,res) => {
  const {token, email} = req.body;
  fetch

})



app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(16).toString('hex');

  fetch("http://localhost/justweed/backend/includes/create-user.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${email}&username=${username}&password=${password}&token=${token}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.message && data.response === 200) {
      req.session.username = username;
      req.session.email = email;
      req.session.save(err => {
        if (err) {
          console.error("Errore salvataggio sessione:", err);
          return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
        }
        res.json(data.data);
      });
    } else {
      res.json( data.data);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
});

app.post("/becomeAseller", (req,res) => {
  const {password, email} = req.body;
  fetch("http://localhost/justweed/backend/become-a-seller.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `password=${password}&email=${email}`
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.response === 200){
      res.json(data.data);
    }else {
      res.statusCode(401).json(data.data);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
});

app.post("/updateData", (req,res) => {
  const {password, email, new_email, new_username, new_password} = req.body;

  fetch("https://localhost/justweed/backend/update-user-info.php" ,{
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `password=${password}&email=${email}&new_email=${new_email ?? null}&new_password=${new_password ?? null}&new_username=${new_username}`
  })
  .then(response => response.json())
  .then(data =>{
    console.log(data);
    if(data.response === 200){
       res.json(data.data)
    }else {
      res.statusCode(401).json(data.data)
    }
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
});

app.post("/updateProducts", (req,res) =>{
  const { id, name, quantity, price, description } = req.body;
  fetch("https://localhost/justweed/backend/update-info-product.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `id=${id}&name=${name ?? null}&quantity=${quantity ?? null}&price=${price ?? null}&description=${description ?? null}`
  })
  .then(response => response.json())
  .then (data =>{
    console.log(data);
    if (data.response === 200){
      res.json(data.data);
    }else{
      res.statusCode(401).json(data.data)
    }
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fetch("http://localhost/justweed/backend/includes/login.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `username=${username}&password=${password}`
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if (data.message && data.response === 200) {
      req.session.username = data.data[0].username;
      req.session.email = data.data[0].email;
      req.session.save(err => {
        if (err) {
          console.error("Errore salvataggio sessione:", err);
          return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
        }
        console.log(data.data[0])
        data = data.data[0]
        res.json(data);
      });
    } else if (!data.message) {
      res.json(data.data);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  });
});

app.get("/products", (req, res) => {
  if (req.session) {
    fetch("http://localhost/JustWeed/backend/includes/view-product.php")
    .then(response => response.json())
    .then(data => {
      if (data.message && data.response === 200) {
        // console.log(data);
        // console.log(data.data);
        res.json(data.data);
      } else if (!data.message) {
        res.json(data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
