<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non e' una richiesta POST");
    }

    require_once "dbh.inc.php";

    $table = "users_jw";
    $email = $_POST["email"];
    // $token = $_POST["token"];
    $username = $_POST["username"];
    $password = $_POST["password"];


    $sql = "SELECT * FROM $table WHERE email = :email AND verified = 'F'";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($result)) {
        throw new Exception("Utente già registrato ma non confermato\nreinviando una email");

    } else {
        $sql = "SELECT * FROM $table WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            throw new Exception("Utente già registrato");
        }

        $sql = "INSERT INTO $table (username, email, password) VALUES (:username, :email, :password)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":password", $password);
        // $stmt->bindParam(":token", $token);
        $stmt->bindParam(":email", $email);
    }

    $stmt->execute();
    $response = [
        "response" => 200,
        "message" => True,
        "data" => "Controlla la email per conferma"
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