<?php

try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php"; 


    $data = isset($_POST["data"]) ? $_POST["data"] : null;
    $nome_titolare = isset($_POST["nome_titolare"]) ? $_POST["nome_titolare"] : null;
    $id = $_POST["id"];
    $table = "cards_jw";

    $sql = "SELECT numero FROM $table WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $card = $stmt->fetchAll(PDO::FETCH_ASSOC);
    

    if (empty($card)){
        throw new Exception("carta inesistente");
    }

    $params = [];
    $columns = [];

    $sql = "UPDATE $table SET ";

    if ($data != null && !empty($data)){
        $columns[] = "scadenza = :data";
        $params[":data"] = $data;
    }

    if($nome_titolare != null && !empty($nome_titolare)){
        $columns[] = "nome_titolare = :nome_titolare";
        $params[":nome_titolare"] = $nome_titolare;
    }

    if (empty($columns)){
        throw new Exception("Nessun dato fornito");
    }

    $sql .= implode(", ", $columns);
    $sql .= " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id);

    if(isset($params[":data"])) $stmt->bindParam(":data", $params[":data"]);
    if(isset($params[":nome_titolare"])) $stmt->bindParam(":nome_titolare", $params[":nome_titolare"]);


    $stmt->execute();
    
    $response = [
        "response" => 200,
        "message" => true,
        "data" => "dati aggiornati correttamente"
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