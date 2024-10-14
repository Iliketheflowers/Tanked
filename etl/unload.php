<?php

require_once 'config.php'; // Adjust the file name to your config file

header('Content-Type: application/json');

// Set a limit for the number of episodes to fetch; default to 100 if not provided
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;

try {
    // Establish a PDO connection
    $pdo = new PDO($dsn, $username, $password, $options);

    // Prepare the SQL query to fetch episodes with limit
    $stmt = $pdo->prepare("
        SELECT show_id, name, airdate, airtime, average_rating
        FROM Episodes
        ORDER BY airdate DESC, airtime DESC
        LIMIT :limit
    ");
    
    // Bind the limit parameter to the query
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);

    // Execute the query
    $stmt->execute();

    // Fetch all results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the results as JSON
    echo json_encode($results, JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    // Return an error in JSON format if the query fails
    echo json_encode(['error' => $e->getMessage()]);
}

?>
