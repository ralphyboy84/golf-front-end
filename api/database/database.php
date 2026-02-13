<?php

class database
{
    private $dbh;

    public function __construct()
    {
        if ($_SERVER["HTTP_HOST"] == "localhost") {
            $SERVERNAME = "database";
            $USERNAME = "root";
            $PASSWORD = "";
            $DATABASE = "golf";
        } else {
            $SERVERNAME = "localhost";
            $USERNAME = "ralphwar";
            $PASSWORD = "Rdubz1984";
            $DATABASE = "ralphwar_golf";
        }

        $this->dbh = new mysqli($SERVERNAME, $USERNAME, $PASSWORD, $DATABASE);
    }

    public function getDatabaseConnection()
    {
        return $this->dbh;
    }
}
