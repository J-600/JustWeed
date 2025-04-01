<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    $email = $_POST["email"];
    $payment = $_POST["payment"];
    $nome = $_POST["nome"];
    $cognome = $_POST["cognome"];
    $city = $_POST["city"];
    $cap = $_POST["cap"];
    $address= $_POST["addess"];
    $piva = $_POST["piva"];
    $cf = $_POST["cf"];
    $descrizione = $_POST["descrizione"];

    $table = "users_jw";

    $sql = "SELECT COUNT(*) $table WHERE email = :email AND type = 'customer'";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($result[0] == 0){
        throw new Exception("Account già registrato come seller");
    }
    $sql = "UPDATE $table SET type = 'seller'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data"=> "Account diventato Seller"
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