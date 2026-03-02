<?php

$ch = curl_init("https://www.facebook.com/AnstrutherGolfClub");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_NOBODY => true, // We only need the header, not the whole page
    CURLOPT_FOLLOWLOCATION => true, // Follow redirects
    CURLOPT_TIMEOUT => 10,
    // CRITICAL: Facebook blocks scripts without a User-Agent
    CURLOPT_USERAGENT => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]);

curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo $httpCode;

if ($httpCode === 200) {
    return ["status" => "Live", "code" => $httpCode];
} elseif ($httpCode === 404) {
    return ["status" => "Broken/Not Found", "code" => $httpCode];
} else {
    return ["status" => "Private or Blocked", "code" => $httpCode];
}
