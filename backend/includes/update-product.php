<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

try {
    if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
        throw new Exception("Richiesta non valida: metodo non consentito", 405);
    }

    parse_str(file_get_contents("php://input"), $putData);

    $requiredFields = ['id', 'name', 'price', 'quantity'];
    foreach ($requiredFields as $field) {
        if (!isset($putData[$field]) || empty($putData[$field])) {
            throw new Exception("Campo obbligatorio mancante: $field", 400);
        }
    }

    require_once "dbh.inc.php";
    $id = (int)$putData['id'];
    $name = htmlspecialchars($putData['name']);
    $price = (float)$putData['price'];
    $quantity = (int)$putData['quantity'];
    $description = htmlspecialchars($putData['description'] ?? '');
    $img = $putData['img'] ?? null;

    if ($id <= 0) throw new Exception("ID prodotto non valido", 400);
    if ($price <= 0) throw new Exception("Prezzo non valido", 400);
    if ($quantity < 0) throw new Exception("Quantità non valida", 400);

    $table = "products_jw";

    $sql = "UPDATE $table SET 
            name = :name, 
            price = :price, 
            quantity = :quantity, 
            description = :description, 
            img = :img 
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':name', $name, PDO::PARAM_STR);
    $stmt->bindParam(':price', $price, PDO::PARAM_STR);
    $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
    $stmt->bindParam(':description', $description, PDO::PARAM_STR);
    
    if ($img && strpos($img, 'data:image/') === 0) {

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
    $pdo = null;
    $stmt = null;
    
    echo json_encode($response);
    exit();
}