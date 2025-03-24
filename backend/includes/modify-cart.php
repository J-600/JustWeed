<?php
try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php"; 

    $qnt = $_POST["qnt"];
    $user = $_POST["user"];
    $del = $_POST["del"] ;
    $id = $_POST["id"];
    $table = "cart_jw";

    if ($del == 0){
        $sql = "DELETE FROM $table WHERE product = :id AND user = :user";
        $stmt = $pdo->prepare($sql);
    }
    else {
        $sql = "UPDATE $table SET qnt = :qnt WHERE product = :id AND user= :user";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":qnt", $qnt);
    }
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":user", $user);

    $stmt->execute();

    

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "modifica avvenuta"
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