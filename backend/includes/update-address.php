<?php 

try {

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Non è una richiesta POST");
    }

    require_once "dbh.inc.php"; 

    $table = "addresses_jw";

    $id = $_POST["id"] ?? 5;
    $name = isset($_POST["name"]) ? $_POST["name"]: null;
    $street = isset($_POST["street"]) ? $_POST["street"] : null;
    $city = isset($_POST["city"]) ? $_POST["city"] : null;
    $zip = isset($_POST["zip"]) ? $_POST["zip"] : null;

    if (empty($id))
        throw new Exception("Indirizzo non esistente");

    $sql = "SELECT name FROM $table WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":id", $id);
    $stmt->execute();

    $address = $stmt->fetchAll(PDO::FETCH_ASSOC);
    

    if (empty($address))
        throw new Exception("Indirizzo non esistente");
    
    $params = [];
    $columns = [];
    $sql = "UPDATE $table SET ";

    if ($name != null && !empty(($name))){
        $columns[] = "name = :name";
        $params[":name"] = $name;
    }

    if ($street != null && !empty($street)){
        $columns[] = "street = :street";
        $params[":street"] = $street;
    }

    if($city != null && !empty($city)){
        $columns[] = "city = :city";
        $params[":city"] = $city;
    }

    if ($zip != null && !empty($zip)){
        $columns[] = "zip = :zip";
        $params[":zip"] = $zip;
    }

    if (empty($columns)){
        throw new Exception("Nessun dato fornito");
    }

    $sql .= implode(", ", $columns);
    $sql .= " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id);

    if(isset($params[":name"])) $stmt->bindParam(":name", $params[":name"]);
    if(isset($params[":street"])) $stmt->bindParam(":street", $params[":street"]);
    if(isset($params[":city"])) $stmt->bindParam(":city", $params[":city"]);
    if(isset($params[":zip"])) $stmt->bindParam(":zip", $params[":zip"]);

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