<?php
try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $email = $_POST["email"];
    $table = "selled_jw";
    $table_products = "products_jw";

    $sql = "SELECT s.date, s.quantity, p.price, p.name, p.id
            FROM $table_products p
            JOIN $table s ON s.id_product = p.id
            WHERE p.email = :email";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

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