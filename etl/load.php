<?php
// Include the database configuration file
include('config.php');

// Establish a PDO connection
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Include the transformed data from the transform.php file
$transformedData = include('transform.php');

// Inserting into the Shows table (capitalized as per your schema)
$shows = $transformedData['shows'];

// Prepare an SQL statement for inserting shows
$insertShowStmt = $pdo->prepare("
    INSERT INTO Shows (id, name) 
    VALUES (:id, :name)
    ON DUPLICATE KEY UPDATE name = VALUES(name)
");

foreach ($shows as $show) {
    // Execute the prepared statement for each show
    $insertShowStmt->execute([
        ':id' => $show['id'],
        ':name' => $show['name']
    ]);
}

// Now inserting into the Episodes table (lowercase 'episodes' as per transform.php)
$episodes = $transformedData['episodes']; // Changed 'Episodes' to 'episodes'

// Prepare an SQL statement for inserting episodes
$insertEpisodeStmt = $pdo->prepare("
    INSERT INTO Episodes (show_id, name, airdate, airtime, average_rating)
    VALUES (:show_id, :name, :airdate, :airtime, :average_rating)
    ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        airdate = VALUES(airdate),
        airtime = VALUES(airtime),
        average_rating = VALUES(average_rating)
");

foreach ($episodes as $episode) {
    // Handle null average_rating by assigning a default value (e.g., 0) if it's null or missing
    $average_rating = isset($episode['average_rating']) ? $episode['average_rating'] : 0;

    // Execute the prepared statement for each episode
    $insertEpisodeStmt->execute([
        ':show_id' => $episode['show_id'],
        ':name' => $episode['name'],
        ':airdate' => $episode['airdate'],
        ':airtime' => $episode['airtime'],
        ':average_rating' => $average_rating
    ]);
}

echo "Data successfully loaded into the database.";
?>
