<?php

try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $email = $_POST["email"];
    $password = $_POST["password"];
    $table = "users_jw";
    $table_products = "products_jw";

    $sql = "SELECT password FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        throw new Exception("Password errata");
    }

    $sql = "DELETE FROM $table_products WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $sql = "DELETE FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data" => "Utente eliminato correttamente..."
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
        "response" => 400,
        "message" => false,
        "data" => $e->getMessage()
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();
