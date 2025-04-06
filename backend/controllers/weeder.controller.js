const path = "http://localhost/JustWeed/backend/includes";
import multer from 'multer';

// Configurazione Multer per file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});

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

export const updateProduct = [
    upload.single('img'), 
    async (req, res) => {
        try {
            const { id } = req.params;
            

            const { name, price, quantity, description } = req.body;
            let imgBase64 = req.body.img;

            if (req.file) {
                imgBase64 = req.file.buffer.toString('base64');
            }


            if (!id || !name || !price || !quantity) {
                return res.status(400).json({ error: "Dati mancanti" });
            }


            const formData = new URLSearchParams();
            formData.append('id', id);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('description', description || '');
            formData.append('img', imgBase64 || '');


            const phpResponse = await fetch(path + "/update-product.php", {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            const data = await phpResponse.json();
            
            if (data.response === 200) {
                res.status(200).json(data.data);
            } else {
                res.status(data.response || 500).json(data.data);
            }
            
        } catch (error) {
            console.error("Errore nel controller:", error);
            res.status(500).json({ error: "Errore interno del server" });
        }
    }
];