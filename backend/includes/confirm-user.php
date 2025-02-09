<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non e' una richiesta POST");
    }

    require_once "dbh.inc.php";

    $email = $_POST["email"];
    $table = "users_jw";

    $sql = "SELECT username FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($result)){
        throw new Exception("Utente non registrato");
    }

    $sql = "UPDATE $table SET verified = 'T', registered_at = NOW() WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    
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