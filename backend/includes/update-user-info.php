<?php


try{

    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php";

    $password = $_POST["password"];
    $new_password = isset($_POST["new_password"]) ? $_POST["new_password"] : null;
    $email = $_POST["email"];
    $new_email = isset($_POST["new_email"]) ? $_POST["new_email"] : null;
    $new_username  = isset($_POST["username"]) ? $_POST["username"] : null;
    $table = "users_jw";

    $sql = "SELECT password FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        throw new Exception("Password errata");
    }

    $sql = "SELECT * FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":password", $password);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($result)){
        throw new Exception("Password Sbagliata...");
    }


    $sql = "UPDATE $table SET";

    $columns = [];
    $params = [];

    if (!empty($new_email)){
        $columns[] = "email = :new_email";
        $params[":new_email"] = $new_email;
    }

    if(!empty($new_password)){
        $columns[] = "password = :new_password";
        $params[":new_password"] = $new_password;
        }

    if (!empty($new_username)){
        $columns[] = "username = :new_username";
        $params[":new_username"] = $username;
    }

    if (empty($columns)) {
        throw new Exception("Nessun dato fornito per l'aggiornamento");
    }

    $sql .= implode(", ", $columns);
    $sql .= " WHERE password = :password";
    $params[':password'] = $password;

    if (isset($params[':new_email'])) $stmt->bindParam(":new_email", $params[":new_email"]);
    if (isset($params[":new_password"])) $stmt->bindParam(":new_password", $params[":new_password"]);
    if (isset($params[':new_username'])) $stmt->bindParam(":new_username", $params[":new_username"]);

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
        "response" => 200,
        "message" => false,
        "data" => $e->getMessage()
        
    ];
    echo json_encode($response);
}

$pdo = null;
$stmt = null;

exit();