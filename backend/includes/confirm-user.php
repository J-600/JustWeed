<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "GET"){
        throw new Exception("Non e' una richiesta GET");
    }

    require_once "dbh.inc.php";

    $token = $_GET["token"];
    $email = $_GET["email"];
    $table = "users_jw";

    $sql = "SELECT username FROM $table WHERE email = :email AND token = :token";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":token", $token);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)){
        throw new Exception("Token scaduto");
    }

    $sql = "UPDATE $table SET verified = 'T' WHERE email = :email AND token = :token";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":token", $token);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response = [
        "response" => 200,
        "message" => true,
        "data" => $result
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