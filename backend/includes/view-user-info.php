<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $table = "users_jw";

    $email = $_POST["email"];
    // $username = $_POST["username"];

    $sql = "SELECT email,username,type,registered_at FROM $table WHERE email = :email AND verified = 'T'";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)){
        throw new Exception("utente non registrato");
    }

    $response = [
        "response" => 200,
        "message" => True,
        "data" => $result
    ];

    echo json_encode($response);

}catch (PDOException $e) {
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