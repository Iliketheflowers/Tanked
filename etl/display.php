<?php
// Path to the JSON file (ensure the path is correct)
$jsonFilePath = 'summarized_ratings.json';

// Check if the file exists before reading
if (file_exists($jsonFilePath)) {
    // Read the JSON file contents
    $jsonData = file_get_contents($jsonFilePath);

    // Decode the JSON data into a PHP array
    $ratings = json_decode($jsonData, true);

    // Display the summarized ratings
    echo "<h2>Summarized Ratings</h2>";
    echo "Morning Rating: " . ($ratings['morning'] ?? 'N/A') . "<br>";
    echo "Midday Rating: " . ($ratings['midday'] ?? 'N/A') . "<br>";
    echo "Evening Rating: " . ($ratings['evening'] ?? 'N/A') . "<br>";
} else {
    echo "Summarized ratings file not found.";
}
?>
