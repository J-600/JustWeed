<?php

$dsn = "mysql:host=php5.hensemberger.it;dbname=j.panora";
$dbusername = "j.panora";
$dbpassword = "j.panora422";

try{
    $pdo = new PDO($dsn, $dbusername, $dbpassword);
    $pdo ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "connection failed". $e->getMessage();
}