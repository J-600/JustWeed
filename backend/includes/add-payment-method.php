<?php
try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    $table = "cards_jw"; 

    $number = $_POST["number"];
    $scadenza = $_POST["scandenza"];
    $nome_titolare = $_POST["nome_titolare"];

    $sql = "INSERT INTO $table (number,scandenza, nome_titolare) VALUES (:number, :scandenza, :nome_titolare)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":number", $number);
    $stmt->bindParam(":scadenza", $scadenza);
    $stmt->bindParam(":nome_titolare", $nome_titolare);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "dati aggiunti correttamente"
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