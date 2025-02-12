<?php
try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $table = "addresses_jw";

    $email = $_POST["email"];
    $name = $_POST["name"];
    $street = $_POST["street"];
    $city = $_POST["city"];
    $zip = $_POST["zip"];

    if (empty($email) || empty($name) || empty($street) || empty($zip) || empty($city))
        throw new Exception("Errore nella ricezione dei dati");

    $sql = "INSERT INTO $table (email, name, street, city, zip) VALUES (:email, :name, :street, :city, :zip)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":street", $street);
    $stmt->bindParam(":city", $city);
    $stmt->bindParam(":zip", $zip);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "Indirizzo aggiunto con successo"
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