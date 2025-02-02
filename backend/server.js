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

const tokenExpirationMap = new Map();
const tokenMailMap = new Map();


function deleteToken(token) {
  tokenExpirationMap.delete(token);
  tokenMailMap.delete(token)
}

async function sendConfirmationEmail(token) {
  const expiration = Date.now() + 10 * 60 * 1000;
  tokenExpirationMap.set(token, expiration);
  // console.log(`Token salvato: ${token}, exiration: ${expiration}`);
  const email = tokenMailMap.get(token);
  let transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: 'noReplyJustWeed@gmail.com',
      pass: 'wstg giop vbtz uasq'
    }
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
      <h1 style="color: #6699cc;">🎉 Benvenuto!</h1>
      <p style="font-size: 16px;">Siamo felici di averti con noi! Per completare la tua registrazione, clicca sul pulsante qui sotto:</p>
      <a href="http://localhost:3001/confirm?token=${token}" style="display: inline-block; padding: 12px 24px; background-color: #6699cc; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; margin: 20px 0;">
        🔑 Conferma il tuo account
      </a>
      <p style="font-size: 14px; color: #777;">Hai solo <strong>10 minuti</strong> per confermare la tua email, quindi affrettati! 🕒</p>
      <p style="font-size: 14px; color: #777;">Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
      <p style="font-size: 14px; color: #4CAF50; word-wrap: break-word;">http://localhost:3001/confirm?token=${token}</p>
      <p style="font-size: 14px; color: #777;">A presto,<br>Il Team JustWeed 🌿</p>
    </div>
  `;

  let mailOptions = {
    from: 'noReplyJustWeed@gmail.com',
    to: email,
    subject: 'Conferma la tua registrazione',
    html: htmlContent,
    text: `Clicca sul seguente link per confermare la tua registrazione: http://localhost:3001/confirm?token=${token}`
  };

  await transporter.sendMail(mailOptions);
}


app.get("/confirm", (req, res) => {

  const { token } = req.query;
  const tokenExpiration = tokenExpirationMap.get(token);
  const email = tokenMailMap.get(token);
  // console.log(token);
  // console.log(email);
  // console.log(tokenExpiration);

  if (!tokenExpiration || Date.now() > tokenExpiration) {
    fetch("http://localhost/justweed/backend/includes/delete-user-unconfirmed.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${email}`
    })
      .then(response => response.json())
      .then(deleteData => {
        deleteToken(token);
        res.json({data: "token scaduto...", message : false});
      })
      .catch(error => {
        console.error("Error deleting user:", error);
        res.status(500).json({data: "error...", message : false});
      });
  } else {
    fetch(`http://localhost/justweed/backend/includes/confirm-user.php`, {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${email}`
    })
      .then(response => response.json())
      .then(data => {
        deleteToken(token);
        if (data.message && data.response === 200) {
          req.session.username = data.data[0].username;
          req.session.email = email;
          req.session.save(err => {
            if (err) {
              console.error("Errore salvataggio sessione:", err);
              return res.status(500).json("Errore durante il salvataggio della sessione");
            }
            res.json({data: "Benvenuto in JustWeed", message : true, email : email, username : data.data[0].username});
          });
        } else if (data.response === 200 && !data.message) {
          res.json({data : "Token Scaduto o account non registrato", message: false});
        } else {
          res.json("Error...")
        }
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json("An error occurred");
      });
  }
});

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(16).toString('hex');
  // console.log(`Token generato: ${token}, Email associata: ${email}`);
  tokenMailMap.set(token, email)
  fetch("http://localhost/justweed/backend/includes/create-user.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${email}&username=${username}&password=${password}`
  })
    .then(response => response.json())
    .then(data => {
      if (data.message && data.response === 200) {
        sendConfirmationEmail(token);
        res.json(data.data);
      } else {
        res.json(data.data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.post("/becomeAseller", (req, res) => {
  const { password, email } = req.body;
  fetch("http://localhost/justweed/backend/become-a-seller.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `password=${password}&email=${email}`
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.response === 200) {
        res.json(data.data);
      } else {
        res.status(401).json(data.data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.post("/updateData", (req, res) => {
  const { password, email, new_email, new_username, new_password } = req.body;

  fetch("https://localhost/justweed/backend/update-user-info.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `password=${password}&email=${email}&new_email=${new_email ?? null}&new_password=${new_password ?? null}&new_username=${new_username}`
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.response === 200) {
        res.json(data.data);
      } else {
        res.status(401).json(data.data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.post("/updateProducts", (req, res) => {
  const { id, name, quantity, price, description } = req.body;
  fetch("https://localhost/justweed/backend/update-info-product.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `id=${id}&name=${name ?? null}&quantity=${quantity ?? null}&price=${price ?? null}&description=${description ?? null}`
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.response === 200) {
        res.json(data.data);
      } else {
        res.status(401).json(data.data);
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
      // console.log(data);
      if (data.message && data.response === 200) {
        req.session.username = data.data[0].username;
        req.session.email = data.data[0].email;
        req.session.save(err => {
          if (err) {
            console.error("Errore salvataggio sessione:", err);
            return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
          }
          // console.log(data.data[0]);
          data = data.data[0];
          res.json(data);
        });
      } else if (!data.message && data.response === 200) {
        try {
          parsedData = typeof data.data === "string" ? JSON.parse(data.data) : data.data;
          console.log(parsedData)
        } catch (error) {
          console.error("Errore di parsing JSON:", error);
          return res.status(500).json({ error: "Errore durante la gestione dei dati" });
        }
        if (parsedData.email) {
          // console.log(parsedData)
          if (tokenMailMap.has(parsedData.email)) {
            sendConfirmationEmail(tokenMailMap.get(parsedData.email));
          } else {
            const token = crypto.randomBytes(16).toString('hex');
            tokenMailMap.set(token, parsedData.email)
            sendConfirmationEmail(token);
          }

        }
        res.json(parsedData.message)
      } else {
        res.json(data.data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.post("/delete-user", (req, res) => {
  const { email, password } = req.body;
  fetch("http://localhost/JustWeed/backend/delete-user.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${email}&password=${password}`
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        res.json(data.data);
      } else {
        res.status(400).json(data.data);
      }
    });
});

app.get("/products", (req, res) => {
  if (req.session) {
    fetch("http://localhost/JustWeed/backend/includes/view-product.php")
      .then(response => response.json())
      .then(data => {
        if (data.message && data.response === 200) {
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

setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;

  for (const [token, expiration] of tokenExpirationMap.entries()) {
    if (now > expiration) {
      tokenExpirationMap.delete(token);
      
      const email = tokenMailMap.get(token);
      if (email) {
        tokenMailMap.delete(token);
      }

      deletedCount++;
    }
  }
}, 60 * 60 * 1000);
