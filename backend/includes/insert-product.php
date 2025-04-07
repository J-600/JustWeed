<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $tableUsers = "weeder_jw";
    $table = "products_jw";
    $name = $_POST["name"];
    $email = $_POST["email"];
    $description = $_POST["description"];
    $price = $_POST["price"];
    $quantity = $_POST["quantity"];
    $img = $_POST["img"];



    $sql = "SELECT * FROM $tableUsers WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)) {
        throw new Exception("Utente non registrato");

    }
    $sql = "INSERT INTO $table (name,email, description, price, quantity, img) VALUES (:name, :email, :description, :price, :quantity, :img)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":price", $price);
    $stmt->bindParam(":quantity", $quantity);
    if ($img && strpos($img, 'data:image/') === 0) {

        $imgData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $img));
        $stmt->bindParam(':img', $imgData, PDO::PARAM_LOB);
    } else {
        $stmt->bindValue(':img', null, PDO::PARAM_NULL);
    }

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "Prodotto registrato correttamente"
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