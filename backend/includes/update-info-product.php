<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }
    
    require_once "dbh.inc.php"; 

    $table = "products_jw";

    $id = isset($_POST["id"]) ? $_POST["id"] : null;
    $name = isset($_POST["name"]) ? $_POST["name"] : null;
    $quantity = isset($_POST["quantity"]) ? $_POST["quantity"] : null;
    $price = isset($_POST["price"]) ? $_POST["price"] : null;
    $description = isset($_POST["description"]) ? $_POST["description"] : null;
    $verified = isset($_POST["verified"]) ? $_POST["verified"] : null;

    $sql = "UPDATE $table SET ";

    $params = [];
    $columns = [];
    
    if (!empty($name)) {
        $columns[] = "name = :name";
        $params[':name'] = $name;
    }
    if (!empty($quantity)) {
        $columns[] = "quantity = :quantity";
        $params[':quantity'] = $quantity;
    }
    if (!empty($price)) {
        $columns[] = "price = :price";
        $params[':price'] = $price;
    }
    if (!empty($description)) {
        $columns[] = "description = :description";
        $params[':description'] = $description;
    }
    if (!empty($verified)) {
        $columns[] = "verified = :verified";
        $params[':verified'] = $verified;
    }


    if (empty($columns)) {
        throw new Exception("Nessun dato fornito per l'aggiornamento");
    }

    $sql .= implode(", ", $columns);
    $sql .= " WHERE id = :id";
    $params[':id'] = $id; 

    $stmt = $pdo->prepare($sql);


    if (isset($params[':name'])) $stmt->bindParam(':name', $params[':name']);
    if (isset($params[':quantity'])) $stmt->bindParam(':quantity', $params[':quantity']);
    if (isset($params[':price'])) $stmt->bindParam(':price', $params[':price']);
    if (isset($params[':description'])) $stmt->bindParam(':description', $params[':description']);
    if (isset($params[':verified'])) $stmt->bindParam(':verified', $params[':verified']);
    if (isset($params[':id'])) $stmt->bindParam(':id', $params[':id']);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data" => "dati aggiornati correttamente"
    ];
    echo json_encode($response);
    
    
    
} catch (PDOException $e) {
    $response = [
        "response" => 500,
        "message" => false,
        "data" => "Errore del database: " . $e->getMessage()
    ];
    echo json_encode($response);
} catch (Exception $e) {
    $response = [
        "response" => 200,
        "message" => false,
        "data" => $e->getMessage()
        
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();