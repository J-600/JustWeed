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