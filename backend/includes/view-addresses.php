<?php
try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $table = "addresses_jw";
    $table_us = "users_jw";
    $email = $_POST["email"] ?? "jhonpanora06@gmail.com";

    $sql = "SELECT a.* FROM $table a
            JOIN $table_us u ON u.verified = 'T'
            WHERE a.email = :email";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if(empty($result))
    {
        throw new Exception("Nessun indirizzo di fatturazione");
    }

    $response = [
        "response" => 200,
        "message" => True,
        "data" => $result
    ];
    echo json_encode($response);

}  catch (PDOException $e) {
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