<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";
    $table = "cards_jw";
    $email = $_POST["email"] ?? "jhonpanora06@gmail.com"; 
    $table_users = "users_jw";

    $sql = "SELECT c.id, c.numero, c.scadenza, c.circuito, c.nome_titolare, c.created_at, c.updated_at 
            FROM $table c
            JOIN $table_users u ON u.email = c.email AND u.verified = 'T'
            WHERE c.email = :email";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)){
        throw new Exception("Nessun metofo di pagamento");
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