<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non e' una richiesta POST");
    }
    require_once "dbh.inc.php";

    $table = "users_jw";
    $username = $_POST["username"];
    $password = $_POST["password"];

    $sql = "SELECT password FROM $table WHERE email = :email OR username = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || $password != $user["password"]) {
        throw new Exception(json_encode(["message"=> "Mail o Password errata", "email" => false]));
    }


    $sql = "SELECT username, email, verified FROM $table WHERE username = :username OR email = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":password", $password);

    $stmt->execute();


    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($result)) {
        throw new Exception(json_encode(["message" => "Mail o password sbagliati", "email" => false]));
    } else if($result[0]["verified"] == "F"){
        throw new Exception(
            json_encode([
                "message" => "Account non verificato. Email per confermarla inviata",
                "email" => $result[0]["email"]
            ])
        );
        
    } else {
        $response = [
        "response" => 200,
        "message" => true,
        "data" => $result
        ];
    }
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