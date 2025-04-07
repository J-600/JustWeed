<?php

try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $table = "selled_jw";
    $table_products = "products_jw";
    $table_addresses = "addresses_jw";
    $table_cards = "cards_jw";
    $email = $_POST["email"] ?? '';
    $id = $_POST["id"] ?? '';

    if (!$id || !$email) {
        throw new Exception("Parametri mancanti: id ordine e email richiesti");
    }

    $sql = "SELECT s.*,
                    p.name as product_name,
                    p.img,
                    p.description as product_description,
                    p.price as product_price,
                    p.quantity as product_quantity,
                    a.name as address_name,
                    a.street as address_street,
                    a.city as address_city,
                    a.zip as address_zip,
                    c.numero as card_number,
                    c.scadenza as card_expiry,
                    c.circuito as card_circuit,
                    c.nome_titolare as card_nome
            FROM $table s
            JOIN $table_products p ON s.id_product = p.id
            JOIN $table_addresses a ON s.id_address = a.id
            JOIN $table_cards c ON s.id_payment = c.id
            WHERE s.id = :id AND s.email = :email";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);



    foreach ($result as $key => $row) {
        if (!empty($row["img"])) {
            $result[$key]["img"] = "data:image/png;base64," . base64_encode($row["img"]);
        } else {
            $result[$key]["img"] = null;
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
