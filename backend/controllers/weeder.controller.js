const path = "http://localhost/JustWeed/backend/includes";

export const viewAndamento = (req,res) => {

    fetch(path + "/view-andamento.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `email=${req.session.email}`
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

export const viewProducts = (req, res) =>{
    fetch(path + "/view-weeder-product.php", {
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `email=${req.session.email}`
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

export const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, quantity, description, img } = req.body;

      fetch(path + "/update-product.php", {
        method: 'PUT',
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: `id=${id}&name=${name}&price=${price}&quantity=${quantity}&description=${description}&img=${img}`
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