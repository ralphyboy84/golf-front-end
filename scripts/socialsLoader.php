<?php
// 1. Define the path to your JSON file
$jsonFile = "../randoms/socialsJson.json";

// 2. Check if the file exists to avoid errors
if (file_exists($jsonFile)) {
    // 3. Read the file content into a string
    $jsonData = file_get_contents($jsonFile);

    // 4. Decode the JSON string into a PHP associative array
    $data = json_decode($jsonData, true);

    $socialsArgs = ["website", "facebook", "instagram"];

    // 5. Use the data
    echo "<pre>";
    foreach ($data as $courseName => $socials) {
        foreach ($socialsArgs as $sm) {
            $valueToUse = $socials[$sm];

            if ($valueToUse != null) {
                if ($sm == "facebook") {
                    $valueToUse = str_replace(
                        "https://www.facebook.com/",
                        "",
                        $valueToUse,
                    );
                } elseif ($sm == "instagram") {
                    $valueToUse = str_replace(
                        "https://www.instagram.com/",
                        "",
                        $valueToUse,
                    );
                }

                $sql = "
                UPDATE clubs SET $sm = '$valueToUse' WHERE name = '$courseName' AND $sm = '';
                ";

                echo $sql . "<br />";
            }
        }
    }
} else {
    echo "File not found.";
}
?>
