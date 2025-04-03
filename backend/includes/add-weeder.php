<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    
    $email = $_POST["email"];
    $payment = $_POST["payment"];
    $nome = $_POST["nome"];
    $cognome = $_POST["cognome"];
    $full_name = $nome . " " . $cognome;
    $city = $_POST["city"];
    $zip = $_POST["cap"];
    $street = $_POST["address"];
    $piva = $_POST["piva"];
    $cf = $_POST["cf"];
    $descrizione = $_POST["descrizione"];

    $table = "weeder_jw";
    $table_cards = "cards_jw";
    $table_address = "addresses_jw";

    $sql = "SELECT * FROM $table WHERE codiceFiscale = :cf";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":cf", $cf);
    $stmt->execute();

    $weeder = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($weeder))
        throw new Exception("utente già seller");

    $sql = "SELECT id FROM $table_cards WHERE metodo = :metodo";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":metodo", $payment);
    $stmt->execute();

    $id_p = $stmt->fetchColumn();
    // echo json_encode($id_p);
    if (empty($id_p))
        throw new Exception("carta necessaria");   

    $sql = "INSERT INTO $table_address (email, name, street, city, zip) VALUES (:email, :name, :street, :city, :zip)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":name", $full_name);
    $stmt->bindParam(":street", $street);
    $stmt->bindParam(":city", $city);
    $stmt->bindParam(":zip", $zip);

    $stmt->execute();

    $sql = "SELECT id FROM $table_address WHERE name = :name AND email = :email AND street = :street AND city = :city AND zip = :zip";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":name", $full_name);
    $stmt->bindParam(":street", $street);
    $stmt->bindParam(":city", $city);
    $stmt->bindParam(":zip", $zip);

    $stmt->execute();

    $id_addr = $stmt->fetchColumn();


    $sql = "INSERT INTO $table (firstName, secondName, email, codiceFiscale, pt, bio, card, address) VALUES (:name, :cognome, :email, :cf, :pt, :bio, :card, :address)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":name", $nome);
    $stmt->bindParam(":cognome", $cognome);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":cf", $cf);
    $stmt->bindParam(":pt", $piva);
    $stmt->bindParam(":bio", $descrizione);
    $stmt->bindParam(":card", $id_p);
    $stmt->bindParam(":address", $id_addr);

    $stmt->execute();


    $response = [
        "response" => 200,
        "message" => true,
        "data"=> "Becomed weeder"
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