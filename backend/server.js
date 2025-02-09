const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const creditCardType = require('credit-card-type');
const session = require('express-session');

const STRIPE_SECRET_KEY = 'sk_test_51Qqap7J0BPVuq51Y0ydAG9kn97Q39HQ2WAP4N0J1s794JiNzwIYj2PoorgFr6A4ZJdvwbMUTwTERatnoFOUf2ltd00A6Q3laNG';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

const tokenExpirationMap = new Map();
const tokenMailMap = new Map();

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
  const { username, email, password } = req.body;
  const token = crypto.randomBytes(16).toString('hex');

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
        sendConfirmationEmail(token, mailOptions);
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


app.get("/confirm", (req, res) => {

  const { token } = req.query;
  const tokenExpiration = tokenExpirationMap.get(token);
  const email = tokenMailMap.get(token);
  // console.log(token);
  // console.log(email);
  // console.log(tokenExpiration);

  if (!tokenExpiration || Date.now() > tokenExpiration) {
    res.json({ data: "token scaduto...", message: false });

    // fetch("http://localhost/justweed/backend/includes/delete-user-unconfirmed.php", {
    //   method: "POST",
    //   headers: { "Content-type": "application/x-www-form-urlencoded" },
    //   body: `email=${email}`
    // })
    //   .then(response => response.json())
    //   .then(deleteData => {
    //     deleteToken(token);
    //     res.json({ data: "token scaduto...", message: false });
    //   })
    //   .catch(error => {
    //     console.error("Error deleting user:", error);
    //     res.status(500).json({ data: "error...", message: false });
    //   });
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
            res.json({ data: "Benvenuto in JustWeed", message: true, email: email, username: data.data[0].username });
          });
        } else if (data.response === 200 && !data.message) {
          res.json({ data: "Token Scaduto o account non registrato", message: false });
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
        // console.log(req.session);
      } else if (!data.message && data.response === 200) {
        try {
          parsedData = typeof data.data === "string" ? JSON.parse(data.data) : data.data;
          console.log(parsedData)
        } catch (error) {
          console.error("Errore di parsing JSON:", error);
          return res.status(500).json({ error: "Errore durante la gestione dei dati" });
        }
        if (parsedData.email) {
          let emailExists = false;
          tokenMailMap.forEach((value, key) => {
            if (value === parsedData.email) {
              emailExists = true;
            }
          });
          if (emailExists) {
            // sendConfirmationEmail(tokenMailMap.get(parsedData.email));
            console.log("token già creato")
            res.json("mail già inviata...")
          } else {
            console.log("inviando la mail");
            const token = crypto.randomBytes(16).toString('hex');
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
              to: parsedData.email,
              subject: 'Conferma la tua registrazione',
              html: htmlContent,
              text: `Clicca sul seguente link per confermare la tua registrazione: http://localhost:3001/confirm?token=${token}`
            };
            tokenMailMap.set(token, parsedData.email)
            sendConfirmationEmail(token, mailOptions);
            res.json(parsedData.message)
          }

        } else {
          res.json(parsedData.message);
        }
      } else {
        res.json(data.data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.post("/updateData", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  }
  const { password, email, new_email, new_username, new_password } = req.body;
  var nE = new_email

  if (email == new_email){
    nE = null
  }
  fetch("http://localhost/justweed/backend/includes/update-user-info.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `password=${password}&email=${email}&new_password=${new_password ?? ""}&new_email=${nE ?? ""}&username=${new_username ?? ""}`
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.response === 200 && data.message) {
        if (new_email){
          req.session.email = new_email;
        }
        if (new_username){
          req.session.username = new_username; 
        }
        req.session.save(err => {
          if (err) {
            console.error("Errore salvataggio sessione:", err);
            return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
          }
          res.json(data.data[0]);
        });
      } else {
        res.status(401).json(data.data);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.get("/products", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    // console.log("t") 
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

app.get("/cardsdata", (req,res) => {
  if (!req.session.username){
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    // console.log(req.session.email)
    fetch("http://localhost/justweed/backend/includes/view-payments-method.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${req.session.email}`
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      if (data.message && data.response === 200){
        res.json(data.data)
      } else if (data.response === 500) {
        res.status(500).json("errore nel db");
      } else {
        res.status(400).json(data)
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
  }
})

app.use(bodyParser.json());

app.post('/verify-card', (req, res) => {
  const { number, expiry, name } = req.body;

  const cardInfo = creditCardType(number);

  if (cardInfo.length === 0) {
    return res.status(400).json({ message: "Numero della carta non valido." });
  }
  if (!luhnCheck(number)) {
    return res.status(400).json({ message: "La carta non è valida." });
  }

  const currentDate = new Date();
  const [month, year] = expiry.split('/');
  const expiryDate = new Date(`20${year}-${month}-01`);

  if (expiryDate < currentDate) {
    return res.status(400).json({ message: "La carta è scaduta." });
  }

  return res.status(200).json({ message: "Verifica completata con successo." });
});


app.post('/verify-card', async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    if (!paymentMethodId) {
      return res.status(400).json({ message: 'Payment method ID is required' });
    }

    // First verify the PaymentMethod exists and is valid
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    // Create a SetupIntent with the payment method
    const setupIntent = await stripe.setupIntents.create({
      payment_method: paymentMethodId,
      confirm: true,
      usage: 'off_session',
      payment_method_types: ['card'],
      // Add your customer ID here if you have one
      // customer: 'cus_xxx',
    });

    // Check the status of the SetupIntent
    switch (setupIntent.status) {
      case 'succeeded':
        return res.json({ success: true });
      case 'requires_action':
      case 'requires_confirmation':
        return res.json({ 
          success: false, 
          clientSecret: setupIntent.client_secret 
        });
      default:
        throw new Error('Unexpected SetupIntent status');
    }

  } catch (error) {
    console.error("Stripe Error:", error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        message: error.message || 'Carta non valida'
      });
    }
    
    return res.status(500).json({ 
      message: 'Errore durante la verifica della carta'
    });
  }
});


function luhnCheck(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}


app.post("/add-card", (req,res) => {
  console.log("aggiungendo")
  if (!req.session.username){
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const {number, scadenza, propietario} = req.body; 
    const bin = number.substring(0, 6);
    fetch(`https://lookup.binlist.net/${bin}`)
        .then(response => response.json())
        .then(data => {
            if (data.scheme) {
                const circuito = data.scheme
            } else {
                res.status(404).json({ error: 'Circuito non trovato' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Errore del server' });
        });

    fetch ("http://localhost/justweed/backend/includes/add-payment-method.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `number=${number}&scadenza=${scadenza}&nome_titolare=${propietario}&email=${req.session.email}&circuito=${ci}`
    })
    .then(response => response.json())
    .then (data =>{
      // console.log(data)
      if (data.message && data.response === 200){
        res.json(data.data);
      } else if (data.response === 500) {
        res.status(500).json("errore nell'upload dei dati");
      } else {
        res.status(400).json(data)
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
  }
})

app.get("/account-info", (req,res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else { 
    fetch("http://localhost/justweed/backend/includes/view-user-info.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${req.session.email}`
    })
    .then(response => response.json())
    .then(data =>{
      // console.log(data) 
      if (data.message && data.response === 200){
        res.json(data.data[0]);
      } else if (data.response === 500) {
        res.status(500).json("errore nel db");
      } else {
        res.status(400).json(data)
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
  }
})

app.post("/becomeAseller", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
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
  }
  
});

app.post("/updateProducts", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  }
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

app.post("/delete-user", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  }
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
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.post("/newpassword", (req, res) => {

  if(req.session.email){
    res.status(401).json("Non autorizzato")
  }
  const { token, password } = req.body;
  const tokenExpiration = tokenExpirationMap.get(token);
  const email = tokenMailMap.get(token);

  if (!tokenExpiration || Date.now() > tokenExpiration) {
    res.status(401).json("token scaduto...")
  } else {

    fetch("http://localhost/JustWeed/backend/includes/forgot-password.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `password=${password}&email=${email}`
    })
      .then(response => response.json())
      .then(data => {
        res.json(data.data);
      })
  }



});

app.post("/forgotpassword", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  const token = crypto.randomBytes(16).toString('hex');
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
      <h1 style="color: #6699cc;">🔒 Reimposta la tua password</h1>
      <p style="font-size: 16px;">
        Abbiamo ricevuto una richiesta per reimpostare la tua password.  
        Clicca sul pulsante qui sotto per procedere:
      </p>
      <a href="http://localhost:3001/newpassword?token=${token}" 
        style="display: inline-block; padding: 12px 24px; background-color: #6699cc; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; margin: 20px 0;">
          🔑 Reimposta la password
      </a>
      <p style="font-size: 14px; color: #777;">
        Se non hai richiesto il reset della password, ignora questa email.  
        Il link scadrà tra <strong>10 minuti</strong>.
      </p>
      <p style="font-size: 14px; color: #777;">Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
      <p style="font-size: 14px; color: #4CAF50; word-wrap: break-word;">
        http://localhost:3001/newpassword?token=${token}
      </p>
      <p style="font-size: 14px; color: #777;">A presto,<br>Il Team JustWeed 🌿</p>
    </div>
`;

  let mailOptions = {
    from: 'noReplyJustWeed@gmail.com',
    to: email,
    subject: 'Reimposta la password',
    html: htmlContent,
    text: `Clicca sul seguente link per reimpostare la password: http://localhost:3001/newpassword?token=${token}`
  };

  tokenMailMap.set(token, email)
  sendConfirmationEmail(token, mailOptions);
  res.json("Mail inviata...")
})


function deleteToken(token) {
  tokenExpirationMap.delete(token);

  tokenMailMap.delete(token)
}

async function sendConfirmationEmail(token, mailOptions) {
  const expiration = Date.now() + 10 * 60 * 1000;
  tokenExpirationMap.set(token, expiration);
  // console.log(`Token salvato: ${token}, exiration: ${expiration}`);
  // const email = tokenMailMap.get(token);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noReplyJustWeed@gmail.com',
      pass: 'wstg giop vbtz uasq'
    }
  });

  await transporter.sendMail(mailOptions);
}



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

app.use((req, res, next) => { 
  if (!req.session || !req.session.username) {
    return res.status(401).json({ error: false });
  }
  next();
  
});

app.get("/session", (req, res) => {
  if (!req.session.username || !req.session.email) {
    return res.status(401).json({ error: "Utente non autenticato" });
  }
  
  res.json({
    username: req.session.username,
    email: req.session.email
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});