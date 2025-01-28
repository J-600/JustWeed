<?php

try{
    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        throw new Exception("Non e' una richiesta POST");
    }

    require_once "dbh.inc.php";

    
}