console.log('Hello, World!');

// Fetch the data from the PHP unload endpoint
fetch('etl/unload.php')
  .then(response => response.json())
  .then(data => {
    // Convert the airtime into Date objects for comparison
    data.forEach(episode => {
      // Parse the airtime into a Date object
      episode.airtimeObj = new Date(`1970-01-01T${episode.airtime}Z`);
    });

    // Define the new time ranges
    const morningStart = new Date('1970-01-01T06:00:00Z');
    const morningEnd = new Date('1970-01-01T16:59:59Z');
    
    const eveningStart = new Date('1970-01-01T17:00:00Z');
    const eveningEnd = new Date('1970-01-02T05:59:59Z'); // Spans across midnight

    // Categorize episodes by time of day
    const morningEpisodes = data.filter(episode => episode.airtimeObj >= morningStart && episode.airtimeObj <= morningEnd);
    const eveningEpisodes = data.filter(episode => 
      (episode.airtimeObj >= eveningStart && episode.airtimeObj <= new Date('1970-01-01T23:59:59Z')) || 
      (episode.airtimeObj >= new Date('1970-01-01T00:00:00Z') && episode.airtimeObj <= eveningEnd)
    );

    // Updated summarize function to filter and sum valid ratings
    const summarize = episodes => {
      // Filter episodes to only include those with valid average_rating > 0 and is a number
      const validEpisodes = episodes.filter(episode => 
        episode.average_rating && !isNaN(episode.average_rating) && episode.average_rating > 0
      );
      
      // Calculate the total of valid ratings
      const totalRating = validEpisodes.reduce((acc, episode) => acc + parseFloat(episode.average_rating), 0);
      
      // Return the average, or 0 if no valid episodes are found
      return (validEpisodes.length > 0) ? totalRating / validEpisodes.length : 0;
    };

    // Calculate the average rating for each period and round to 2 decimals
    const morningAvgRating = summarize(morningEpisodes).toFixed(2);
    const eveningAvgRating = summarize(eveningEpisodes).toFixed(2);

    // Display the average ratings in the HTML
    document.getElementById('morningAvg').textContent = morningAvgRating;
    document.getElementById('eveningAvg').textContent = eveningAvgRating;

  })
  .catch(error => console.error('Error fetching data:', error));



  // Script to make content scroll inside the TV screen as user scrolls
document.addEventListener('scroll', () => {
  const content = document.querySelector('.content');
  const scrollPosition = window.scrollY;
  content.style.transform = `translateY(-${scrollPosition}px)`;
});


