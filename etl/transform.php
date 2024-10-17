<?php

$data = include('extract.php');
// var_dump($data);

$transformedData = [];

// Arrays für Shows und Episoden vorbereiten
$shows = [];
$episodes = [];

// Daten durchgehen und in die richtige Struktur umwandeln
foreach ($data as $entry) {
    // Show-Daten extrahieren (nur einmal pro Show speichern)
    $showId = $entry['_embedded']['show']['id'];
    if (!isset($shows[$showId])) {
        $shows[$showId] = [
            'id' => $showId,
            'name' => $entry['_embedded']['show']['name']
        ];
    }

    // Episoden-Daten extrahieren
    $episodes[] = [
        'id' => $entry['id'],
        'show_id' => $showId,
        'name' => $entry['name'],
        'airdate' => $entry['airdate'],
        'airtime' => $entry['airtime'],
        'average_rating' => $entry['rating']['average']
    ];
}

// Transformation abgeschlossen, Daten ausgeben oder weiter verarbeiten


$transformedData['shows'] = $shows;
$transformedData['episodes'] = $episodes;
return $transformedData;

// Optional: Die transformierten Daten können in die Datenbank eingefügt werden
?>





