
<?php
try {
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }
    require_once "dbh.inc.php";

    $password = $_POST["password"];
    $email = $_POST["email"];
    $new_email = $_POST["new_email"] ?? null;
    $new_username = $_POST["new_username"] ?? null;
    $table = "users_jw";

    $sql = "SELECT password FROM $table WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $password != $user["password"]) {
        throw new Exception("Password errata");
    }

    if ($new_email != null && $new_email !== $email) {
        $sql_check_email = "SELECT COUNT(*) FROM $table WHERE email = :new_email";
        $stmt_check_email = $pdo->prepare($sql_check_email);
        $stmt_check_email->bindParam(':new_email', $new_email);
        $stmt_check_email->execute();
        if ($stmt_check_email->fetchColumn() > 0) {
            throw new Exception("Email già esistente");
        }
    }

    if ($new_username !== null) {
        $sql_check_username = "SELECT COUNT(*) FROM $table WHERE username = :new_username";
        $stmt_check_username = $pdo->prepare($sql_check_username);
        $stmt_check_username->bindParam(':new_username', $new_username);
        $stmt_check_username->execute();
        if ($stmt_check_username->fetchColumn() > 0) {
            throw new Exception("Username già esistente");
        }
    }

    $sql = "UPDATE $table SET ";
    $columns = [];
    $params = [];

    if ($new_email != null && $new_email !== $email) {
        $columns[] = "email = :new_email";
        $params[":new_email"] = $new_email;
    }


    if ($new_username !== null) {
        $columns[] = "username = :new_username";
        $params[":new_username"] = $new_username;
    }

    if (empty($columns)) {
        throw new Exception("Nessun dato fornito per l'aggiornamento");
    }

    $sql .= implode(", ", $columns);
    $sql .= " WHERE email = :email"; 
    $params[':email'] = $email;

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => &$value) {
        $stmt->bindParam($key, $value);
    }

    $stmt->execute();

    echo json_encode([
        "response" => 200,
        "message" => true,
        "data" => "Dati aggiornati correttamente"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "response" => 500,
        "message" => false,
        "data" => "Errore del database: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        "response" => 200,
        "message" => false,
        "data" => $e->getMessage()
    ]);
}

$pdo = null;
$stmt = null;
exit();