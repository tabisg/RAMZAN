import './style.css'

// 1. Set up the basic layout inside the app div
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>🌙 Ramadan 1447 Timings</h1>
    <div class="search-box">
      <input type="text" id="cityInput" value="New Delhi" placeholder="Enter your city..." />
      <p>Currently showing times for: <strong id="cityDisplay">New Delhi, India</strong></p>
    </div>
    <div id="loading">Loading precise timings...</div>
    <div id="ramadanList" class="list-container"></div>
  </div>
`;

// 2. Grab the elements we need to interact with
const cityInput = document.querySelector('#cityInput');
const cityDisplay = document.querySelector('#cityDisplay');
const ramadanList = document.querySelector('#ramadanList');
const loading = document.querySelector('#loading');

// 3. The function to fetch and display data
async function fetchTimings(city) {
  loading.style.display = 'block';
  ramadanList.innerHTML = '';
  cityDisplay.innerText = `${city}, India`;

  try {
    // Fetch February and March 2026
    const resFeb = await fetch(`https://api.aladhan.com/v1/calendarByCity/2026/2?city=${city}&country=India&method=1`);
    const resMar = await fetch(`https://api.aladhan.com/v1/calendarByCity/2026/3?city=${city}&country=India&method=1`);
    
    const dataFeb = await resFeb.json();
    const dataMar = await resMar.json();
    
    // Combine and filter for Ramadan (Month 9)
    const combined = [...dataFeb.data, ...dataMar.data];
    const ramadanDays = combined.filter(day => day.date.hijri.month.number === 9);
    
    loading.style.display = 'none';
    
    // Create a card for each day
    ramadanDays.forEach((day, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div>
          <strong style="font-size: 18px;">Roza ${index + 1}</strong>
          <div class="date-text">${day.date.readable}</div>
        </div>
        <div style="text-align: right;">
          <div class="sehar-text">Sehar: ${day.timings.Imsak.split(' ')[0]}</div>
          <div class="iftar-text">Iftar: ${day.timings.Maghrib.split(' ')[0]}</div>
        </div>
      `;
      ramadanList.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    loading.innerText = "Error loading data. Try checking the city name.";
  }
}

// 4. Run it for the first time
fetchTimings(cityInput.value);

// 5. Update when the user types a new city (with a slight delay so it doesn't spam the API)
let timeout = null;
cityInput.addEventListener('keyup', (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetchTimings(e.target.value);
  }, 500);
});