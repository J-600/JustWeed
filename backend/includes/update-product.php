<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

try {
    // Verifica metodo PUT
    if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
        throw new Exception("Richiesta non valida: metodo non consentito", 405);
    }

    // Leggi i dati della richiesta PUT
    parse_str(file_get_contents("php://input"), $putData);

    // Validazione campi obbligatori
    $requiredFields = ['id', 'name', 'price', 'quantity'];
    foreach ($requiredFields as $field) {
        if (!isset($putData[$field]) || empty($putData[$field])) {
            throw new Exception("Campo obbligatorio mancante: $field", 400);
        }
    }

    require_once "dbh.inc.php";

    // Preparazione dati
    $id = (int)$putData['id'];
    $name = htmlspecialchars($putData['name']);
    $price = (float)$putData['price'];
    $quantity = (int)$putData['quantity'];
    $description = htmlspecialchars($putData['description'] ?? '');
    $img = $putData['img'] ?? null;

    // Validazione dati
    if ($id <= 0) throw new Exception("ID prodotto non valido", 400);
    if ($price <= 0) throw new Exception("Prezzo non valido", 400);
    if ($quantity < 0) throw new Exception("Quantità non valida", 400);

    $table = "products_jw";

    // Costruzione query dinamica
    $sql = "UPDATE $table SET 
            name = :name, 
            price = :price, 
            quantity = :quantity, 
            description = :description, 
            img = :img 
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    // Bind parametri
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':price', $price, PDO::PARAM_STR); // Usato STR per decimali
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->bindParam(':description', $description, PDO::PARAM_STR);
    
    // Gestione immagine (BLOB o NULL)
    if ($img && strpos($img, 'data:image/') === 0) {
        // Decodifica base64 se presente
        $imgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $img));
        $stmt->bindParam(':img', $imgData, PDO::PARAM_LOB);
    } else {
        $stmt->bindValue(':img', null, PDO::PARAM_NULL);
    }

    if (!$stmt->execute()) {
        throw new Exception("Errore durante l'aggiornamento del prodotto", 500);
    }

    $response = [
        "response" => 200,
        "message" => "Prodotto aggiornato con successo",
        "data" => [
            "affected_rows" => $stmt->rowCount()
        ]
    ];

} catch (PDOException $e) {
    $response = [
        "response" => 500,
        "message" => "Errore del database",
        "error" => $e->getMessage()
    ];
} catch (Exception $e) {
    $statusCode = $e->getCode() ?: 400;
    $response = [
        "response" => $statusCode,
        "message" => $e->getMessage(),
        "error" => $e->getMessage()
    ];
} finally {
    // Chiudi le connessioni
    $pdo = null;
    $stmt = null;
    
    echo json_encode($response);
    exit();
}