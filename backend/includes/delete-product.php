<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non è una richiesta POST");
    }
    require_once "dbh.inc.php";
    

    $id = $_POST["id"];
    $table = "products_jw";
    $table_cart = "cart_jw";
    $sql = "DELETE FROM $table_cart WHERE product = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $sql = "DELETE FROM $table WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data" => "Prodotto eliminato correttamente..."
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