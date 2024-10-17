console.log('Hello, World!');

// Fetch the data from the PHP unload endpoint
fetch('etl/unload.php')
  .then(response => response.json())
  .then(data => {
    // Convert the airtime into Date objects for comparison
    data.forEach(episode => {
      episode.airtimeObj = new Date(`1970-01-01T${episode.airtime}Z`);
    });

    // Define time ranges for morning and evening
    const morningStart = new Date('1970-01-01T06:00:00Z');
    const morningEnd = new Date('1970-01-01T16:59:59Z');
    const eveningStart = new Date('1970-01-01T17:00:00Z');
    const eveningEnd = new Date('1970-01-02T05:59:59Z');

    // Categorize episodes by time of day
    const morningEpisodes = data.filter(episode => episode.airtimeObj >= morningStart && episode.airtimeObj <= morningEnd);
    const eveningEpisodes = data.filter(episode => 
      (episode.airtimeObj >= eveningStart && episode.airtimeObj <= new Date('1970-01-01T23:59:59Z')) || 
      (episode.airtimeObj >= new Date('1970-01-01T00:00:00Z') && episode.airtimeObj <= eveningEnd)
    );

    // Summarize valid ratings
    const summarize = episodes => {
      const validEpisodes = episodes.filter(episode => episode.average_rating && !isNaN(episode.average_rating) && episode.average_rating > 0);
      const totalRating = validEpisodes.reduce((acc, episode) => acc + parseFloat(episode.average_rating), 0);
      return (validEpisodes.length > 0) ? totalRating / validEpisodes.length : 0;
    };

    // Calculate and display average ratings
    const morningAvgRating = summarize(morningEpisodes).toFixed(2);
    const eveningAvgRating = summarize(eveningEpisodes).toFixed(2);
    document.getElementById('morningAvg').textContent = morningAvgRating;
    document.getElementById('eveningAvg').textContent = eveningAvgRating;
  })
  .catch(error => console.error('Error fetching data:', error));

let isTVOn = false; // TV starts off

// Toggle the TV on and off
function toggleTV() {
  const tvScreen = document.getElementById('tvScreen');
  const content = tvScreen.querySelector('.content');
  
  if (isTVOn) {
    tvScreen.classList.add('off');
    content.classList.add('hidden');
  } else {
    tvScreen.classList.remove('off');
    setTimeout(() => {
      content.classList.remove('hidden');
      getRatingsAndPlaceExplosions(); // Place explosions after TV is on
    }, 100);
  }

  isTVOn = !isTVOn;
}

// Start the TV off with hidden content
window.onload = function () {
  const tvScreen = document.getElementById('tvScreen');
  const content = tvScreen.querySelector('.content');
  tvScreen.classList.add('off');
  content.classList.add('hidden');
};

// Place the explosion based on the rating
function placeExplosion(rating, scaleElement, explosionElement) {
  const scaleWidth = scaleElement.offsetWidth;
  const explosionPosition = (rating / 10) * scaleWidth;
  explosionElement.style.left = `${(explosionPosition / scaleWidth) * 100}%`;
}

// Get ratings and place explosions
function getRatingsAndPlaceExplosions() {
  const morningAvgRating = parseFloat(document.getElementById('morningAvg').textContent);
  const eveningAvgRating = parseFloat(document.getElementById('eveningAvg').textContent);

  const morningScale = document.querySelector('.morning-bombthrow .scale-image');
  const eveningScale = document.querySelector('.evening-bombthrow .scale-image');
  const morningExplosion = document.getElementById('morning-explosion');
  const eveningExplosion = document.getElementById('evening-explosion');

  placeExplosion(morningAvgRating, morningScale, morningExplosion);
  placeExplosion(eveningAvgRating, eveningScale, eveningExplosion);
}

// Recalculate explosions on window resize
window.onresize = function () {
  getRatingsAndPlaceExplosions();
};
