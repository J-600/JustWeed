<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    $table = "cart_jw";
    $id = $_POST["id"];
    $email = $_POST["email"];
    $qnt = $_POST["qnt"];

    $sql = "SELECT id, qnt FROM $table WHERE product = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); 
    if (!empty($result)){
        $qnt += $result[0]["qnt"];
        $sql = "UPDATE $table SET qnt = :qnt WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":qnt", $qnt);
        $stmt->bindParam(":id", $result[0]["id"]);
        $stmt->execute();

    } else {
    $sql = "INSERT INTO $table (user, product, qnt) VALUES (:user, :product, :qnt)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":user", $email);
    $stmt->bindParam(":product", $id);
    $stmt->bindParam(":qnt", $qnt);

    $stmt->execute();
    }

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "Prodotto aggiunto al carrello"
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
        "response" => 500,
        "message" => false,
        "data" => $e->getMessage()
        
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();