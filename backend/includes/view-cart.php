<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST")
        throw new Exception("Non è una richiesta POST");

    require_once "dbh.inc.php";

    $user = $_POST["user"] ?? "jhonpanora06@gmail.com";
    $table = "cart_jw";
    $table_products = "products_jw";
    $table_users = "users_jw";

    $sql = "SELECT c.product AS id, c.qnt AS quantity, u.username AS seller, p.name, p.img, p.description, p.price FROM $table c
            JOIN $table_products p ON c.product = p.id
            JOIN $table_users u ON c.user = u.email
            WHERE user = :user";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":user", $user);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($result)) {
        foreach ($result as $key => $row) {
            if (!empty($row["img"])) {
                $result[$key]["img"] = "data:image/png;base64," . base64_encode($row["img"]);
            } else {
                $result[$key]["img"] = null;
            }
        }
    }
    

    $response = [
        "response" => 200,
        "message" => True,
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
