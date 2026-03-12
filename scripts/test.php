<?php

$SERVERNAME = "database";
$USERNAME = "root";
$PASSWORD = "";
$DATABASE = "golf";

$dbh = new mysqli($SERVERNAME, $USERNAME, $PASSWORD, $DATABASE);

$tmp = [];
$y = 0;

$sql = "
SELECT id, lat, lon
FROM clubs
WHERE lat NOT IN (
    SELECT from_lat
    FROM mapping
)
AND region != 'islands'
LIMIT 0,1
";

$result = $dbh->query($sql);

if ($result->num_rows == 1) {
    while ($row = $result->fetch_assoc()) {
        $fromLat = $row["lat"];
        $fromLon = $row["lon"];
        $key = $row["id"];
    }
}

$locations = [[$fromLon, $fromLat]];

for ($x = 0; $x <= 24; $x++) {
    $limiter = $x * 25;

    $sql = "
    SELECT id, lat, lon
    FROM clubs
    WHERE id != '$key'
    AND region != 'islands'
    LIMIT $limiter, 25
    ";

    $result = $dbh->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($locations, [$row["lon"], $row["lat"]]);

            $newArray[$y]["from_lat"] = $fromLat;
            $newArray[$y]["from_lon"] = $fromLon;
            $newArray[$y]["to_lat"] = $row["lat"];
            $newArray[$y]["to_lon"] = $row["lon"];
            $y++;
        }
    }
}

$totalLocations = count($locations);

// 3. Create the destinations array dynamically
// range(1, 4) creates [1, 2, 3, 4]
$dynamicDestinations = range(1, $totalLocations - 1);

$apiKey =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJhNzgxY2IxMzJlYjRkMzliYTgzZWFjMmJkNjMzYThiIiwiaCI6Im11cm11cjY0In0="; // Replace with your actual key
$profile = "driving-car"; // Ensure this is driving-car, not foot-walking
$url = "https://api.openrouteservice.org/v2/matrix/{$profile}";

// Define your coordinates [longitude, latitude]
// $locations = [
//     [-2.729476, 56.492281], // Carnoustie (Source: Index 0)
//     [-2.802423, 56.343684], // St Andrews (Dest: Index 1)
//     [-4.833056, 55.315405], // Turnberry (Dest: Index 2)
//     [-2.02053, 57.277429], // Trump Aberdeen
// ];

$destinations = [];

$body = [
    "locations" => $locations,
    "sources" => [0],
    "destinations" => $dynamicDestinations,
    "metrics" => ["distance", "duration"],
    "units" => "mi", // Set to miles for your 24-mile journey
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Accept: application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
    "Authorization: $apiKey",
    "Content-Type: application/json; charset=utf-8",
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

echo "<pre>";
print_r($data);
$count = 1;
$x = 0;

foreach ($data["durations"][0] as $duration) {
    $newArray[$x]["duration"] = $duration;
    $x++;
}

$z = 0;

foreach ($data["distances"][0] as $distance) {
    $newArray[$z]["distance"] = $distance;
    $z++;
}

foreach ($newArray as $row) {
    $sql = "
    SELECT *
    FROM mapping
    WHERE from_lat = '{$row["from_lat"]}'
    AND from_lon = '{$row["from_lon"]}'
    AND to_lat = '{$row["to_lat"]}'
    AND to_lon = '{$row["to_lon"]}'
    ";

    $result = $dbh->query($sql);
    if ($result->num_rows == 0) {
        $insertSql = "
        INSERT INTO mapping (from_lat, from_lon, to_lat, to_lon, distance, duration)
        VALUES
        ('{$row["from_lat"]}', '{$row["from_lon"]}', '{$row["to_lat"]}', '{$row["to_lon"]}', '{$row["distance"]}', '{$row["duration"]}')
        ";

        $dbh->query($insertSql);
    }
}

// Handling the 2522.21 seconds logic
// if (isset($data["durations"])) {
//     $seconds = $data["durations"][0][1]; // Time from Point A to Point B
//     $minutes = round($seconds / 60, 2);
//     $distance = $data["distances"][0][1];

//     echo "Distance: " . $distance . " miles\n";
//     echo "Duration: " . $minutes . " minutes (" . $seconds . " seconds)\n";
// } else {
//     echo "Error: Could not retrieve data.";
// }

// async function getDistances() {
//   const apiKey = '';

//   // All points in one array: [Origin, Dest1, Dest2, Dest3]
//   const locations = [
//     [-2.729476, 56.492281], // Carnoustie (Source: Index 0)
//     [-2.802423, 56.343684], // St Andrews (Dest: Index 1)
//     [-4.833056, 55.315405], // Turnberry (Dest: Index 2)
//     [-2.020530, 57.277429]  // Trump Aberdeen
//   ];

//   const response = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': apiKey
//     },
//     body: JSON.stringify({
//       locations: locations,
//       sources: [0],           // Use the first location as the origin
//       destinations: [1, 2, 3], // Compare it to indices 1, 2, and 3
//       metrics: ['distance', "duration"],   // You can also add 'duration'
//       units: 'mi'              // 'm', 'km', or 'mi'
//     })
//   });

//   const data = await response.json();

//   let distanceObject = []

//   // Data.distances will be an array of arrays: [[distTo1, distTo2, distTo3]]
//   data.distances[0].forEach((distance, index) => {
//     console.log(`Distance to Destination ${index + 1}: ${distance} miles`);
//     distanceObject.push({ from: locations[0], to: locations[index + 1], distance})
//   });

//   console.log(distanceObject)

// // data.durations[0].forEach((dist, index) => {
// //     console.log(`duration to Destination ${index + 1}: ${dist} seconds`);
// //   });
// }

// getDistances()
