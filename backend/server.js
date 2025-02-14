const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const creditCardType = require('credit-card-type');
const session = require('express-session');
const { console } = require('inspector');

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
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0A1128; border-radius: 12px; min-height: 100vh;">
  <tr>
    <td align="center" valign="center">
      <!-- Contenitore principale -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; background: #1E2633; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; margin: 20px; padding: 40px;">
        <tr>
          <td align="center" style="font-family: Arial, sans-serif; color: #E5E7EB;">
            <!-- Titolo con gradient -->
            <h1 style="
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #60A5FA, #818CF8);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              margin-bottom: 25px;
            ">
              🎉 JustWeed - Benvenuto!
            </h1>

            <!-- Messaggio principale -->
            <p style="
              font-size: 16px;
              line-height: 1.5;
              color: #9CA3AF;
              margin-bottom: 25px;
            ">
              La tua registrazione è quasi completata! Clicca sul pulsante per attivare l'account:
            </p>

            <!-- Bottone con gradient -->
            <a href="http://localhost:3001/confirm?token=${token}" style="
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(45deg, #4F46E5, #9333EA);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 25px;
              transition: opacity 0.3s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              🚀 Attiva Account
            </a>

            <!-- Timer -->
            <p style="
              font-size: 14px;
              color: #FBBF24;
              margin-bottom: 25px;
            ">
              ⏳ Il link scadrà tra <strong>10 minuti</strong>
            </p>

            <!-- Link alternativo -->
            <div style="
              background: #2C3E50;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 25px;
            ">
              <p style="
                font-size: 14px;
                color: #9CA3AF;
                margin: 0 0 10px 0;
              ">
                Se il pulsante non funziona, copia questo link:
              </p>
              <code style="
                color: #60A5FA;
                word-break: break-all;
                font-size: 12px;
                background: rgba(96, 165, 250, 0.1);
                padding: 8px 12px;
                border-radius: 4px;
                display: block;
              ">
                http://localhost:3001/confirm?token=${token}
              </code>
            </div>

            <!-- Footer -->
            <p style="
              font-size: 14px;
              color: #6B7280;
              margin: 20px 0 0 0;
            ">
              A presto,<br>
              <span style="color: #60A5FA;">Il Team JustWeed</span> 🌿
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
  let mailOptions = {
    from: 'noReplyJustWeed@gmail.com',
    to: email,
    subject: 'Conferma la tua registrazione',
    html: htmlContent,
    text: `Clicca sul seguente link per confermare la tua registrazione: http://localhost:3001/confirm?token=${token}`
  };
  const isEmailPending = Array.from(tokenMailMap.values()).includes(email);

  if (isEmailPending) {
    return res.status(400).json({ error: "Una richiesta di registrazione è già in corso per questa email" });
  }
  // console.log(`Token generato: ${token}, Email associata: ${email}`);
  tokenMailMap.set(token, email)
  // console.log(tokenMailMap)
  fetch("http://localhost/justweed/backend/includes/create-user.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${email}&username=${username}&password=${password}`
  })
    .then(response => response.json())
    .then(data => {
      if (data.response === 200) {
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
  // console.log(tokenMailMap)
  // console.log(tokenExpirationMap)

  if (!tokenExpiration || Date.now() > tokenExpiration) {
    // console.log("scaduto")
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
        // console.log(data)
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
              <div class="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1E2633] text-center text-white p-8">
  <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">🎉 Benvenuto!</h1>
  <p class="text-lg mb-6">Siamo felici di averti con noi! Per completare la tua registrazione, clicca sul pulsante qui sotto:</p>
  <a href="http://localhost:3001/confirm?token=${token}" class="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 mb-6">
    🔑 Conferma il tuo account
  </a>
  <p class="text-sm text-gray-400 mb-4">Hai solo <strong>10 minuti</strong> per confermare la tua email, quindi affrettati! 🕒</p>
  <p class="text-sm text-gray-400 mb-4">Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
  <p class="text-sm text-green-500 break-words mb-6">http://localhost:3001/confirm?token=${token}</p>
  <p class="text-sm text-gray-400">A presto,<br>Il Team JustWeed 🌿</p>
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

  if (email == new_email) {
    nE = null
  }
  fetch("http://localhost/justweed/backend/includes/update-user-info.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `password=${password}&email=${email}&new_password=${new_password ?? ""}&new_email=${nE ?? ""}&username=${new_username ?? ""}`
  })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      if (data.response === 200 && data.message) {
        if (new_email) {
          req.session.email = new_email;
        }
        if (new_username) {
          req.session.username = new_username;
        }
        req.session.save(err => {
          if (err) {
            console.error("Errore salvataggio sessione:", err);
            return res.status(500).json({ error: "Errore durante il salvataggio della sessione" });
          }
          res.json(data.data);
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

app.get("/addresses", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    fetch("http://localhost/justweed/backend/includes/view-addresses.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${req.session.email}`
    })
      .then(response => response.json())
      .then(data => {

        if (data.response === 200) {
          res.json(data.data);
        } else if (data.response === 500) {
          res.status(500).json("errore nel db")
        } else {
          res.status(400).json(data.data)
        }

      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
})

app.post("/add-address", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const { name, street, city, zip } = req.body;

    fetch("http://localhost/justweed/backend/includes/add-address.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${req.session.email}&name=${name ?? ""}&street=${street ?? ""}&city=${city ?? ""}&zip=${zip ?? ""}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.response === 200) {
          res.json(data.data);
        } else if (data.response === 500) {
          res.status(500).json("errore nel db");
        } else {
          res.status(400).json(data.data)
        }
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
})

app.get("/view-purchase", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
  fetch("http://localhost/justweed/backend/includes/view-purchase.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${req.session.email}`
  })
    .then(response => response.json())
    .then(data => {

      if (data.response === 200 && res.message){
        let res_temp = {}
        data.data.forEach(x => {
          !res_temp[x["date"]] ? res_temp[x["date"]] = [x] : res_temp[x["date"]].push(x)
        });
        res.json(res_temp)
      } else if (data.response === 500) {
        res.status(500).json("errore nel db");
      } else {
        res.json(data.data)
      }
    })
    .catch(error => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
  }
})

app.post("/update-address", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const { id, name, street, city, zip } = req.body;
    // console.log(req.body)
    fetch("http://localhost/justweed/backend/includes/update-address.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `id=${id ?? ""}&name=${name ?? ""}&street=${street ?? ""}&city=${city ?? ""}&zip=${zip ?? ""}`
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        if (data.response === 200) {
          res.json(data.data);
        } else if (data.response === 500) {
          res.status(500).json("errore nel db");
        } else {
          res.status(400).json(data.data)
        }
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
})

app.post("/delete-address", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const { id } = req.body;
    fetch("http://localhost/justweed/backend/includes/delete-address.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `id=${id}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.response === 200) {
          res.json(data.data)
        } else if (data.response === 500) {
          res.status(500).json("errore nell'upload dei dati");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
})

app.get("/cardsdata", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    fetch("http://localhost/justweed/backend/includes/view-payments-method.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${req.session.email}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.response === 200) {
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

// app.use(bodyParser.json());

// app.post('/verify-card', (req, res) => {
//   const { number, expiry, name } = req.body;

//   const cardInfo = creditCardType(number);

//   if (cardInfo.length === 0) {
//     return res.status(400).json({ message: "Numero della carta non valido." });
//   }
//   if (!luhnCheck(number)) {
//     return res.status(400).json({ message: "La carta non è valida." });
//   }

//   const currentDate = new Date();
//   const [month, year] = expiry.split('/');
//   const expiryDate = new Date(`20${year}-${month}-01`);

//   if (expiryDate < currentDate) {
//     return res.status(400).json({ message: "La carta è scaduta." });
//   }

//   return res.status(200).json({ message: "Verifica completata con successo." });
// });


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

app.post("/add-card", (req, res) => {
  // console.log("aggiungendo")
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const { metodoPagamento, numero, scadenza, nome_titolare, circuito } = req.body;
    // console.log(req.body) 
    // console.log(scadenza)
    let [month, year] = scadenza.split('/');
    month = month.padStart(2, '0');
    year = year.slice(-2);
    fetch("http://localhost/justweed/backend/includes/add-payment-method.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `number=${numero}&metodo=${metodoPagamento}&scadenza=${`${month}/${year}`}&nome_titolare=${nome_titolare}&email=${req.session.email}&circuito=${circuito}`
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        if (data.message && data.response === 200) {
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

app.post("/update-card", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const { cardId, scadenza, nome_titolare } = req.body;
    fetch("http://localhost/justweed/backend/includes/update-card.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `id=${cardId}&data=${scadenza ?? ""}&nome_titolare=${nome_titolare ?? ""}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.response === 200) {
          res.json(data.data)
        } else if (data.response === 500) {
          res.status(500).json("errore nell'upload dei dati");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
})

app.post("/delete-card", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    const { cardId } = req.body;
    fetch("http://localhost/justweed/backend/includes/delete-card.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `id=${cardId}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.response === 200) {
          res.json(data.data)
        } else if (data.response === 500) {
          res.status(500).json("errore nell'upload dei dati");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
})

app.get("/account-info", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ error: "Utente non autenticato" });
  } else {
    fetch("http://localhost/justweed/backend/includes/view-user-info.php", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: `email=${req.session.email}`
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data) 
        if (data.message && data.response === 200) {
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
        // console.log(data); 
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
      // console.log(data);
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
  // console.log(req.body) 
  fetch("http://localhost/Justweed/backend/includes/delete-user.php", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `email=${email}&password=${password}`
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        req.session.destroy(err => {
          if (err) {
            return res.status(500).send("Errore nel logout");
          }
        });
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

  if (req.session.email) {
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
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0A1128; border-radius: 12px; min-height: 100vh;">
  <tr>
    <td align="center" valign="center">
      <!-- Contenitore principale -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; background: #1E2633; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; margin: 20px; padding: 40px;">
        <tr>
          <td align="center" style="font-family: Arial, sans-serif; color: #E5E7EB;">
            <!-- Titolo con gradient -->
            <h1 style="
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(45deg, #60A5FA, #818CF8);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              margin-bottom: 25px;
            ">
              🔒 Reimposta Password
            </h1>

            <!-- Messaggio principale -->
            <p style="
              font-size: 16px;
              line-height: 1.5;
              color: #9CA3AF;
              margin-bottom: 25px;
            ">
              Abbiamo ricevuto una richiesta di reset password. Clicca sul pulsante per reimpostare le credenziali:
            </p>

            <!-- Bottone con gradient -->
            <a href="http://localhost:3001/newpassword?token=${token}" style="
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(45deg, #4F46E5, #9333EA);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 25px;
              transition: opacity 0.3s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              🔑 Reimposta Password
            </a>

            <!-- Avviso sicurezza -->
            <p style="
              font-size: 14px;
              color: #F472B6;
              margin-bottom: 25px;
            ">
              ⚠️ Se non hai richiesto il reset, ignora questa email
            </p>

            <!-- Timer -->
            <div style="
              background: #2C3E50;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 25px;
            ">
              <p style="
                font-size: 14px;
                color: #FBBF24;
                margin: 0;
              ">
                ⏳ Link valido per <strong>10 minuti</strong>
              </p>
            </div>

            <!-- Link alternativo -->
            <div style="
              background: #2C3E50;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 25px;
            ">
              <p style="
                font-size: 14px;
                color: #9CA3AF;
                margin: 0 0 10px 0;
              ">
                Link alternativo:
              </p>
              <code style="
                color: #60A5FA;
                word-break: break-all;
                font-size: 12px;
                background: rgba(96, 165, 250, 0.1);
                padding: 8px 12px;
                border-radius: 4px;
                display: block;
              ">
                http://localhost:3001/newpassword?token=${token}
              </code>
            </div>

            <!-- Footer -->
            <p style="
              font-size: 14px;
              color: #6B7280;
              margin: 20px 0 0 0;
            ">
              A presto,<br>
              <span style="color: #60A5FA;">Il Team JustWeed</span> 🌿
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
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