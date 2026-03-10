<?php

$ch = curl_init();

$params = [
    "pageNumber" => 1,
    "pageSize" => 500,
    "clubIds" => 2035,
    "sorting" => [
        [
            "orderBy" => "CompetitionDate",
            "order" => "ASC",
        ],
    ],
    "dateFrom" => "Sun Mar 08 2026",
    "dateTo" => "Thu Dec 31 2026",
    "regionIds" => "",
    "provinceIds" => "",
    "competitionFixtureTypeIds" => "",
    "competitionScoreFormatIds" => "",
    "isNineHoles" => "",
    "genders" => "",
    "userLatitude" => 56.613289,
    "userLongitude" => -3.46239,
    "radius" => "",
    "applyContentModeration" => "false",
    "fixtureAgeGroup" => "",
    "fixtureStatus" => "Unpublished",
];

curl_setopt_array($ch, [
    CURLOPT_URL => "https://www.scottishgolf.org/api/competitions/GetFixtures",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($params), // form encoded
    CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"],
]);

$response = curl_exec($ch);
curl_close($ch);

$info = json_decode($response, true);

echo "<pre>";
print_r($info);
