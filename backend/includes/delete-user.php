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
    $table_cart = "cart_jw";
    $table_comments = "comments_jw";
    $table_selled = "selled_jw";
    $table_weeder = "weeder_jw";
    $table_address = "addresses_jw";
    $table_cards = "cards_jw";
    $table_tags = "tags_jw";

    if (empty($email) || empty($password)) {
        throw new Exception("Fornire email e password");
    }

    $sql = "SELECT password FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $password != $user["password"]) {
        throw new Exception("Password errata");
    }
    // $sql = "DELETE FROM $table_selled WHERE email = :email";
    // $stmt = $pdo->prepare($sql);
    // $stmt->bindParam(':email', $email);
    // $stmt->execute();

    // $sql = "SELECT id FROM $table_products WHERE email = :email";
    // $stmt = $pdo->prepare($sql);
    // $stmt->bindParam(':email', $email);
    // $stmt->execute();

    // $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $sql = "DELETE FROM $table_comments WHERE id = :id";
    // $stmt = $pdo->prepare($sql);
    // foreach ($res as $row) {
    //     $stmt->bindValue(':id', $row['id'], PDO::PARAM_INT);
    //     $stmt->execute();
    // }

    // $sql = "DELETE FROM $table_tags WHERE id = :id";
    // $stmt = $pdo->prepare($sql);
    // foreach ($res as $row) {
    //     $stmt->bindValue(':id', $row['id'], PDO::PARAM_INT);
    //     $stmt->execute();
    // }

    // $sql = "DELETE FROM $table_products WHERE email = :email";
    // $stmt = $pdo->prepare($sql);
    // $stmt->bindParam(':email', $email);
    // $stmt->execute();

    // // $sql = "DELETE FROM $table_address WHERE email = :email";
    // // $stmt = $pdo->prepare($sql);
    // // $stmt->bindParam(':email', $email);
    // // $stmt->execute();

    // // $sql = "DELETE FROM $table_cards WHERE email = :email";
    // // $stmt = $pdo->prepare($sql);
    // // $stmt->bindParam(':email', $email);
    // // $stmt->execute();

    // $sql = "DELETE FROM $table_weeder WHERE email = :email";
    // $stmt = $pdo->prepare($sql);
    // $stmt->bindParam(':email', $email);
    // $stmt->execute();

    $sql = "DELETE FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => true,
        "data" => "Utente eliminato correttamente"
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
