const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');

const apiKey = 'da28c0983d5446a54b260ffeed8807f4';
const baseURL = `https://api.openweathermap.org/data/2.5/forecast`;//?lat={lat}&lon={lon}&appid={API key}`;


searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    const searchValue = searchBar.value;

    

    searchBar.value = '';
})