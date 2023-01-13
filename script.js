const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const dayCards = document.querySelectorAll('.day-card');
const pastSearches = document.querySelectorAll('.past-search');
const pastSearchContainer = document.getElementById('past-search-container');
const dashboard = document.getElementById('dashboard');
let clickedPastSearch = false;

const apiKey = 'da28c0983d5446a54b260ffeed8807f4';
const locationBaseURL = `https://api.openweathermap.org/data/2.5/forecast`;
const citySearchBaseURL= `http://api.openweathermap.org/geo/1.0/direct`;
const currentWeatherBaseURL = `https://api.openweathermap.org/data/2.5/weather`;
const weatherIconURL = `http://openweathermap.org/img/wn/`;



const searchCity = async function() {
    
    const citySearchValue = searchBar.value;
    // Reset search bar value to default
    searchBar.value = '';

    // Use city name to search for lon/lat via API
    const cityRes = await fetch(`${citySearchBaseURL}?q=${citySearchValue}&limit=1&appid=${apiKey}`);
    const cityCoord = await cityRes.json();
    const lat = cityCoord[0].lat;
    const lon = cityCoord[0].lon;


    // Update Dashboard ---------------------------------------------- 
    const currentWeatherRes = await fetch(`${currentWeatherBaseURL}?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
    const currentWeatherData = await currentWeatherRes.json();

    dashboard.innerHTML = `<h1><strong>${currentWeatherData.name} (${(new Date(currentWeatherData.dt*1000)).toLocaleDateString('en-US')})<img src='${weatherIconURL}/${currentWeatherData.weather[0].icon}.png' height="36" width="36"></strong></h1><br>
        Temp: ${currentWeatherData.main.temp} °F<br>
        Wind: ${currentWeatherData.wind.speed} MPH<br>
        Humidity: ${currentWeatherData.main.humidity}%`    



    // Update Day Cards ------------------------------------------------

    // Use lon/lat to find 5 day weather forecast for given coordinate via API
    const weatherRes = await fetch(`${locationBaseURL}?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
    const weatherData = await weatherRes.json();
   
    // Each day has 8 time periods. using the 4th time period as that represents mid-day
    let dayCount = 2;

    // Populate each day card with data from the given day
    dayCards.forEach((card) => {
        const dayData = weatherData.list[dayCount];

        card.innerHTML = `<strong>${(new Date(dayData.dt*1000)).toLocaleDateString('en-US')}</strong><br>
        <img src='${weatherIconURL}/${dayData.weather[0].icon}.png'><br>
        Temp: ${dayData.main.temp} °F<br>
        Wind: ${dayData.wind.speed} MPH<br>
        Humidity: ${dayData.main.humidity}%`
        dayCount = dayCount + 8;
    });


    // Add current search to past search list if it's a new search

    if(!clickedPastSearch){
        // First turn the city name into proper case
        const properCaseList = citySearchValue.split(' ').map((word) => {
            return word[0].toUpperCase() + word.slice(1);
        });
        const properCaseWord = properCaseList.join(' ');

        // Create new element and add to DOM 
        const newPastSearch = document.createElement('div');
        newPastSearch.classList.add('tile','is-child','box', 'past-search');
        newPastSearch.textContent = properCaseWord;
        pastSearchContainer.appendChild(newPastSearch);
    };
    
    clickedPastSearch = false;
};

// Event listener for search bar
searchButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await searchCity();
});

console.log(pastSearches);

// Event listener for past searches
pastSearchContainer.addEventListener('click', async (event) => {
    const search = event.target;

    searchBar.value = search.textContent;
    clickedPastSearch = true;
    await searchCity();
});





