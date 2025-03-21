<?php
try{

    if($_SERVER["REQUEST_METHOD"] != "POST")
        throw new Exception("Non è una richiesta POST");

    $product_id = filter_input(INPUT_POST, 'product', FILTER_VALIDATE_INT);
    $comment = htmlspecialchars($_POST['comment']);
    $stars = filter_input(INPUT_POST, 'star', FILTER_VALIDATE_FLOAT, [
        'options' => [
            'min_range' => 0,
            'max_range' => 5
        ]
    ]);
    $user = htmlspecialchars($_POST['user']);
    $product = $_POST["product"];
    $table = "comments_jw";

    $sql = "INSERT INTO $table (description, star, user, product) VALUES (:description, :star, :user, :product)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":description", $comment);
    $stmt->bindParam(":star", $star);
    $stmt->bindParam(":user", $user);
    $stmt->bindParam(":product", $product);

    $stmt->execute();

    $response = [
        "response" => 200,
        "message" => True,
        "data" => "Commento inserito correttamente"
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
