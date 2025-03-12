<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $table = "products_jw";
    $table_usr = "users_jw";
    $id = $_POST["id"];

    $sql = "SELECT p.id, p.name, p.img, p.description, p.price, p.quantity, p.verified, u.username FROM $table p
            JOIN $table_usr u ON p.email = u.email
            WHERE id = :id LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)) {
        throw new Exception("Non sono presenti prodotti");
    } else {
        $result[0]["img"] = "data:image/png;base64," . base64_encode($result[0]["img"]);
        $response = [
            "response" => 200,
            "message" => true,
            "data" => $result
        ];
        echo json_encode($response);
    }

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
