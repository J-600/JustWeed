<?php

try{

    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $password = $_POST["password"];
    $email = $_POST["email"];
    $table = "users_jw";

    $sql = "UPDATE $table SET password = :password WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":password", $password);
    $stmt->bindParam(":email", $email);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data" => "password aggiornata correttamente"
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