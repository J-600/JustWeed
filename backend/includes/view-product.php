<?php
try {
    if ($_SERVER["REQUEST_METHOD"] != "GET") {
        throw new Exception("Non è una richiesta GET");
    }

    require_once "dbh.inc.php";

    $table = "products_jw";

    $sql = "SELECT * FROM $table";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)) {
        throw new Exception("Non sono presenti prodotti");
    } else {
        // Converti le immagini in Base64
        foreach ($result as $key => $row) {
            if (!empty($row["img"])) {
                $result[$key]["img"] = "data:image/png;base64," . base64_encode($row["img"]);
            } else {
                $result[$key]["img"] = null; // Evita problemi se l'immagine è assente
            }
        }

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
