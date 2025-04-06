<?php


try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $email = $_POST["email"] ?? "jhonpanora06@gmail.com";
    $table = "products_jw";

    $sql = "SELECT * FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":email", $email);
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