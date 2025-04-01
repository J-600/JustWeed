// import inspector from 'inspector';

const path = "http://localhost/JustWeed/backend/includes";

export const viewCart = (req, res) => {
    fetch(path + "/view-cart.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `user=${req.session.email}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.response === 200) {
                res.json(data.data)
            } else {
                res.status(500).json("error")
            }
        })
}

export const insertCart = (req, res) => {
    const { product, qnt } = req.body;
    fetch(path + "/insert-cart.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `id=${product}&email=${req.session.email}&qnt=${qnt ?? 1}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.response === 200) {
                res.json(data.data);
            } else {
                res.status(500).json(data.data)
            }
        })
}

export const updateCart = (req, res) => {
    const { id, qnt, del } = req.body;
    // console.log(qnt)
    fetch(path + "/modify-cart.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `id=${id}&user=${req.session.email}&qnt=${qnt}&del=${del ?? 1}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.response === 200) {
                res.json(data.data);
            } else {
                res.status(data.response).json(data.data);
            }
        })
}

export const product = (req, res) => {
    const { id } = req.body;
    fetch(path + "/view-single-product.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.response === 200) {
                res.json(data.data[0]);
            } else if (!data.message) {
                res.json(data);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
        });
}

export const products = (req, res) => {
    fetch(path + "/view-product.php")
        .then(response => response.json())
        .then(data => {
            if (data.message && data.response === 200) {
                res.json(data.data);
            } else if (!data.message) {
                res.status(data.response).json(data.data);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
        });
};

export const tag = (req, res) => {
    const { id } = req.body;
    fetch(path + "/view-tag.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.response === 200 && data.message) {
                res.json(data.data)
            } else if (data.response === 500) {
                res.status(500).json("errore nel db");
            } else {
                res.status(201).json(data.data)
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
        });
}

export const viewTags = (req, res) => {
    fetch(path + "/view-tags.php")
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.response === 200 && data.message) {
                res.json(data.data)
            } else {
                res.status(data.response).json(data.data)
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
        });
}

export const comments = (req, res) => {
    const { id } = req.body;
    fetch(path + "/view-comments.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            if (data.response === 200) {
                res.json(data.data)
            } else {
                res.status(500).json("errore nel db");
            }
        })
        .catch(error => {
            console.error("Error during fetch:", error);
            res.status(500).json({ error: "Errore interno del server", details: error.message });
        });
}

export const addComment = (req, res) => {
    if (!req.body)
        throw new Error("undefined req body")
    const { id, title, user, comment, star } = req.body;
    fetch(path + "/insert-comment.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `product=${id}&comment=${comment}&user=${user ? "anonimo" : req.session.username}&title=${title}&star=${star}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.response === 200) {
                res.json("Commento aggiunto correttamente")
            } else {
                res.status(400).json("error")
            }

        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({ error: "En error occurred" });
        });
}

export const viewPurchase = (req, res) => {
    fetch(path + "/view-purchase.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `email=${req.session.email}`
    })
        .then(response => response.json())
        .then(data => {

            if (data.response === 200 && data.message) {
                let res_temp = {}
                data.data.forEach(x => {
                    !res_temp[x["date"]] ? res_temp[x["date"]] = [x] : res_temp[x["date"]].push(x)
                });
                // console.log(res_temp)
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

export const updateProducts = (req, res) => {
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

};