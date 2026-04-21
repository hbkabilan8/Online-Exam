<?php
include "config.php";
if(isset($_SESSION['user'])){
    echo $_SESSION['user'];
}
?>
