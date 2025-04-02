import { response } from 'express';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = 'sk_test_51Qqap7J0BPVuq51Y0ydAG9kn97Q39HQ2WAP4N0J1s794JiNzwIYj2PoorgFr6A4ZJdvwbMUTwTERatnoFOUf2ltd00A6Q3laNG';
const stripe = new Stripe(STRIPE_SECRET_KEY);

const path = "http://localhost/JustWeed/backend/includes";


export const updateData = (req, res) => { //post
    const { password, email, new_email, new_username, new_password } = req.body;
    var nE = new_email

    if (email == new_email) {
        nE = null
    }
    fetch(path + "/update-user-info.php", {
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

};

export const addresses = (req, res) => {//get
    fetch(path + "/view-addresses.php", {
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

export const addAddress = (req, res) => { //post
    const { name, street, city, zip } = req.body;

    fetch(path + "/add-address.php", {
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

export const updateAddress = (req, res) => {//post
    const { id, name, street, city, zip } = req.body;
    // console.log(req.body)
    fetch(path + "/update-address.php", {
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

export const deleteAddress = (req, res) => {//post
    const { id } = req.body;
    fetch(path + "/delete-address.php", {
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

export const cardsdata = (req, res) => {//get
    fetch(path + "/view-payments-method.php", {
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

export const verifyCard = async (req, res) => {//post
    try {
        const { paymentMethodId } = req.body;
        if (!paymentMethodId) {
            return res.status(400).json({ message: 'Payment method ID is required' });
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        const setupIntent = await stripe.setupIntents.create({
            payment_method: paymentMethodId,
            confirm: true,
            usage: 'off_session',
            payment_method_types: ['card'],
        });

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

        if (error.type === 'StripeCardError') {
            return res.status(400).json({
                message: error.message || 'Carta non valida'
            });
        }

        return res.status(500).json({
            message: 'Errore durante la verifica della carta'
        });
    }
};

export const addCard = (req, res) => {//post
    const { metodoPagamento, numero, scadenza, nome_titolare, circuito } = req.body;
    // console.log(req.body) 
    // console.log(scadenza)
    let [month, year] = scadenza.split('/');
    month = month.padStart(2, '0');
    year = year.slice(-2);
    fetch(path + "/add-payment-method.php", {
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

export const updateCard = (req, res) => {//post 
    const { cardId, scadenza, nome_titolare } = req.body;
    fetch(path + "/update-card.php", {
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

export const deleteCard = (req, res) => {//post
    const { cardId } = req.body;
    fetch(path + "/delete-card.php", {
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

export const accountInfo = (req, res) => {//get
    fetch(path + "/view-user-info.php", {
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

export const deleteUser = (req, res) => {//get
    const { email, password } = req.body;
    // console.log(req.body) 
    fetch(path + "/delete-user.php", {
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
};

export const addWeeder = (req, res) => {
    const { metodoPagamento, name, cognome, city, cap, address, piva, cf, descrizione } = req.body
    // console.log(req.body) 
    fetch(path + "/add-weeder.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `email=${req.session.email}&payment=${metodoPagamento}&nome=${name}&cognome=${cognome}&city=${city}&cap=${cap}&address=${address}&piva=${piva}&cf=${cf}&descrizione=${descrizione}`
    })
    .then(response => response.json())
    .then (data => {
        if (data.response === 200) {
            res.json(data.data);
        } else {
            res.status(data.response).json(data.data);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
    });
}