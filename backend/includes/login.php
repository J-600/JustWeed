<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non e' una richiesta POST");
    }
    require_once "dbh.inc.php";

    $table = "users_jw";
    $username = $_POST["username"];
    $password = $_POST["password"];

    $sql = "SELECT username, email FROM $table WHERE username = :username OR email = :username AND password = :password";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":password", $password);

    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)) {
        throw new Exception("Mail o password sbagliati");
    } else {

        $response = [
        "response" => 200,
        "message" => true,
        "data" => $result
        ];
    }
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