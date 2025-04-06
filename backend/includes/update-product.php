<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "PUT"){
        throw new Exception("Non è una richiesta PUT");
    }

    $id = $_POST["id"];
    $name = $_POST["name"];
    $price = $_POST["price"];
    $quantity = $_POST["quantity"];
    $description = $_POST["description"];
    $img = $_POST["img"];

    $table = "products_jw";

    $sql = "UPDATE $table SET name = :name,  price = :price, quantity = :quantity, description = :description, img = :img WHERE id = :id";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':img', $img, PDO::PARAM_LOB);

    $stmt->execute();


    $response = [
        "response" => 200,
        "message" => true,
        "data"=> "Prodotto aggiornato"
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
        "response" => 400,
        "message" => false,
        "data" => $e->getMessage()
        
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();