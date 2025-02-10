<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }


    $data = isset($_POST["data"]) ? $_POST["data"] : null;
    $nome_titolare = isset($_POST["nome_titolare"]) ? $_POST["nome_titolare"] : null;
    $metodo = $_POST["newMetodo"];
    $email = $_POST["email"];

    $sql = "";


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