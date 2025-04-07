<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $email = $_POST["email"];
    $payment = $_POST["payment"];
    $address = $_POST["address"];
    $product = $_POST["product"];
    $quantity = $_POST["quantity"];

    $table = "selled_jw";

    $sql = "INSERT INTO $table (email, id_payment, id_address, id_product,quantity , deliveryDate) VALUES (:email, :payment, :address, :product, :quantity, CURRENT_DATE() + 7)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":payment", $payment);
    $stmt->bindParam(":address", $address);
    $stmt->bindParam(":quantity", $quantity);
    $stmt->bindParam(":product", $product);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "Prodotto acquistato correttamente"
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