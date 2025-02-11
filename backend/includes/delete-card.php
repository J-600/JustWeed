<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    $table = "cards_jw"; 

    $id = $_POST["id"];

    $sql = "SELECT numero FROM $table WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $card = $stmt->fetchAll(PDO::FETCH_ASSOC);
    

    if (empty($card)){
        throw new Exception("carta inesistente");
    }

    $sql = "DELETE FROM $table WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data" => "carta rimossa con successo"
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