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








  let isTVOn = false; // TV starts off

  // Function to toggle the TV on and off
  function toggleTV() {
    const tvScreen = document.getElementById('tvScreen');
    const content = tvScreen.querySelector('.content');
  
    if (isTVOn) {
      // Turn off the TV: fade the screen to black and hide content
      tvScreen.classList.add('off');
      content.classList.add('hidden');
    } else {
      // Turn on the TV: fade the screen back to transparent and show content
      tvScreen.classList.remove('off');
  
      // Delay removing the hidden class to allow the fade-in transition
      setTimeout(() => {
        content.classList.remove('hidden');
        // Only place the explosions once the TV is turned on and content is visible
        getRatingsAndPlaceExplosions();
      }, 100); // Small delay ensures the transition is triggered
    }
  
    isTVOn = !isTVOn; // Toggle the state
  }
  
  // Ensure the TV starts off with content hidden and screen black
  window.onload = function () {
    const tvScreen = document.getElementById('tvScreen');
    const content = tvScreen.querySelector('.content');
  
    // Add the "off" and "hidden" classes when the page loads
    tvScreen.classList.add('off');
    content.classList.add('hidden');
  };
  
  // Function to place the explosion based on the average rating
  function placeExplosion(rating, scaleElement, explosionElement) {
    const scaleWidth = scaleElement.offsetWidth; // Get the width of the scale image
    const maxRating = 10; // Maximum rating is 10
    const explosionPosition = (rating / maxRating) * scaleWidth; // Calculate the X position based on the rating
  
    // Adjust the left position of the explosion image
    explosionElement.style.left = `${explosionPosition - (explosionElement.offsetWidth / 2)}px`; // Center explosion
  }
  
  // Function to get the ratings from the HTML and place the explosions
  function getRatingsAndPlaceExplosions() {
    // Get the morning and evening ratings from the displayed HTML
    const morningAvgRating = parseFloat(document.getElementById('morningAvg').textContent);
    const eveningAvgRating = parseFloat(document.getElementById('eveningAvg').textContent);
  
    // Get the morning and evening scale and explosion elements
    const morningScale = document.querySelector('.morning-bombthrow .scale-image');
    const eveningScale = document.querySelector('.evening-bombthrow .scale-image');
    const morningExplosion = document.getElementById('morning-explosion');
    const eveningExplosion = document.getElementById('evening-explosion');
  
    // Place the explosions based on the ratings from the HTML
    placeExplosion(morningAvgRating, morningScale, morningExplosion);
    placeExplosion(eveningAvgRating, eveningScale, eveningExplosion);
  }
  
  // Ensure images are loaded before placing explosions
  window.onload = function () {
    const tvScreen = document.getElementById('tvScreen');
    const content = tvScreen.querySelector('.content');
  
    // Add the "off" and "hidden" classes when the page loads
    tvScreen.classList.add('off');
    content.classList.add('hidden');
  };
  