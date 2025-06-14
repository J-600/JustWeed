<?php

try{

    if ($_SERVER["REQUEST_METHOD"] != "GET") {
        throw new Exception("Non è una richiesta GET");
    }
    require_once "dbh.inc.php";

    $table =  "tags_jw";

    $sql = "SELECT * FROM $table";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);


    
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
        "response" => 500,
        "message" => false,
        "data" => $e->getMessage()
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();
