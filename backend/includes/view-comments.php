<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST")
        throw new Exception("Non è una richiesta POST");

    require_once "dbh.inc.php";

    $id = $_POST["id"] ?? 15;
    $table = "comments_jw";

    $sql = "SELECT * FROM $table WHERE product = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($result))
        throw new Exception("Non ci sono commenti");

    $response = [
        "response" => 200,
        "message" => True,
        "data" => $result
    ];



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
