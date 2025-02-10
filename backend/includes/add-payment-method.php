<?php
try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    $table = "cards_jw"; 

    $number = $_POST["number"];
    $email = $_POST["email"];
    $circuito = $_POST["circuito"];
    $scadenza = $_POST["scadenza"];
    $nome_titolare = $_POST["nome_titolare"];
    $metodo = $_POST["metodo"];

    $sql = "INSERT INTO $table (numero, email, metodo, scadenza, circuito, nome_titolare) VALUES (:number, :email , :metodo,:scadenza, :circuito, :nome_titolare)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":number", $number);
    $stmt->bindParam(":scadenza", $scadenza);
    $stmt->bindParam(":metodo", $metodo);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':circuito', $circuito);
    $stmt->bindParam(":nome_titolare", $nome_titolare);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => True,
        "data" => $nome_titolare
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