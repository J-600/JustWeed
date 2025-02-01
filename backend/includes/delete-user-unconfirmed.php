<?php

try{

    // if ($_SERVER["REQUEST_METHOD"] != "POST"){
    //     throw new Exception("Non è una richiesta POST");
    // }

    require_once "dbh.inc.php";

    $email = $_POST["email"] ?? "jhonpanora06@gmail.com";
    $table = "users_jw";
    $table_products = "products_jw";


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
        "response" => 200,
        "message" => false,
        "data" => $e->getMessage()
        
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();